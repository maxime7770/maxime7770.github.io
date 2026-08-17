---
layout: post
title: Structured Matrices in Deep Learning
date: 2025-05-03 00:00:00 +0000
description: How mathematical structure can make neural-network layers smaller and faster, from Toeplitz matrices to Butterfly and Monarch layers.
tags:
  - deep-learning
  - model-compression
  - linear-algebra
categories:
  - math
  - machine-learning
giscus_comments: true
font: "JetBrains Mono, monospace"
---

While working on an article about [model compression](https://towardsdatascience.com/model-compression-make-your-machine-learning-models-lighter-and-faster/), I came across a concept I had never really studied before: **structured matrices**.

The basic idea is surprisingly simple. A dense matrix lets us learn every entry independently. But do we always need that much freedom?

What if, instead, we forced the entries to follow a pattern? We would have fewer parameters to store and, if we choose the pattern carefully, a much faster way to multiply the matrix by a vector.

In this article, we will build that idea progressively. We will start with Toeplitz and circulant matrices, see why the Fast Fourier Transform appears, and then move to more expressive structures such as Kronecker, Butterfly, and Monarch matrices. Finally, we will discuss the catch: fewer operations on paper do not automatically mean a faster neural network.

I will assume that you are familiar with basic linear algebra and neural-network layers. You do not need to know anything about structured matrices or the FFT.

## The Problem With Dense Linear Layers

Consider a linear layer without its bias:

$$
y = Wx,
$$

where $$W \in \mathbb{R}^{n \times n}$$ and $$x \in \mathbb{R}^n$$.

The matrix $$W$$ contains $$n^2$$ parameters. Multiplying it by $$x$$ also takes roughly $$n^2$$ multiply-add operations.

This grows quickly. If $$n=4096$$, one matrix contains almost 16.8 million parameters. Stored in 16-bit precision, that is about 32 MB for a single layer. A modern model may contain dozens—or hundreds—of matrices of comparable size.

Dense matrices are useful because they are extremely expressive: every output can learn a different relationship with every input. But that expressivity is also expensive.

The question behind structured matrices is therefore:

> Can we restrict the matrix enough to make it cheaper, while keeping enough freedom for the model to learn a useful transformation?

## What Makes a Matrix Structured?

A structured matrix is a matrix whose entries are related through a known rule. Instead of learning every entry of $$W$$, we learn a smaller set of parameters $$\theta$$ and use them to define the complete matrix:

$$
W = W(\theta), \qquad \dim(\theta) \ll n^2.
$$

The rule can take several forms:

- values can repeat along diagonals;
- the matrix can be built from smaller matrices;
- it can be written as a product of sparse factors;
- or it can have low rank after applying a particular transformation.

This can give us two different benefits.

First, we may need far fewer parameters. This reduces the memory required to store the model.

Second, the structure may give us a specialized multiplication algorithm. We no longer need to construct the dense matrix and perform the usual multiplication. We can apply the transformation directly.

These benefits are related, but they are not the same. A matrix can be cheap to store and still be awkward to multiply on a GPU. We will come back to this distinction later.

## Toeplitz Matrices: Repeating Along Diagonals

Let's begin with a simple example. A Toeplitz matrix has the same value everywhere along each diagonal:

$$
T =
\begin{pmatrix}
a & b & c & d \\
e & a & b & c \\
f & e & a & b \\
g & f & e & a
\end{pmatrix}.
$$

Notice what happened. A general $$4 \times 4$$ matrix needs 16 parameters. This Toeplitz matrix only needs 7: its first row and first column, with the top-left value shared by both.

More generally, we can write

$$
T_{i,j} = t_{i-j}.
$$

An $$n \times n$$ Toeplitz matrix therefore contains only $$2n-1$$ independent parameters.

There is another way to understand this pattern. Each output coordinate applies the same weights to the input, but at a different offset. This is exactly the kind of weight sharing that appears in a one-dimensional convolution.

To see it, write one output coordinate:

$$
y_i = \sum_{j=0}^{n-1} T_{i,j}x_j
    = \sum_{j=0}^{n-1} t_{i-j}x_j.
$$

The coefficient depends on the distance between $$i$$ and $$j$$, not on their absolute positions. Once we recognize the operation as a convolution, we can embed it in a slightly larger circular convolution (using zero-padding) and compute it in $$O(n\log n)$$ time with the FFT instead of $$O(n^2)$$.

This connection is not accidental. A convolutional layer is itself a structured linear transformation. The convolution kernel is small, but it defines a much larger matrix whose entries repeat across space.

## Circulant Matrices: Toeplitz With Wrap-Around

A circulant matrix adds one more constraint. Every row is a cyclic shift of the row above it:

$$
C =
\begin{pmatrix}
c_0 & c_3 & c_2 & c_1 \\
c_1 & c_0 & c_3 & c_2 \\
c_2 & c_1 & c_0 & c_3 \\
c_3 & c_2 & c_1 & c_0
\end{pmatrix}.
$$

The word *cyclic* matters. When a value moves beyond one edge, it reappears on the other side. An $$n \times n$$ circulant matrix is completely determined by its first column $$c$$, so it needs only $$n$$ parameters.

The corresponding multiplication is a **circular convolution**:

$$
(Cx)_i = \sum_{j=0}^{n-1} c_{(i-j) \bmod n}x_j.
$$

Now the FFT enters the picture.

The Fourier transform converts a convolution into an element-wise multiplication. If $$F$$ denotes the discrete Fourier transform, then

$$
Cx = F^{-1}\left((Fc) \odot (Fx)\right),
$$

where $$\odot$$ represents element-wise multiplication.

We perform two FFTs, one element-wise product, and one inverse FFT. The complete operation costs $$O(n\log n)$$ rather than $$O(n^2)$$, and we never need to construct $$C$$. During inference, $$Fc$$ can also be cached because the weights no longer change.

Here is a small PyTorch implementation:

```python
import torch
from torch import nn


class CirculantLinear(nn.Module):
    def __init__(self, size, bias=True):
        super().__init__()
        self.size = size
        self.first_column = nn.Parameter(torch.randn(size) / size**0.5)
        self.bias = nn.Parameter(torch.zeros(size)) if bias else None

    def forward(self, x):
        # Circular convolution becomes multiplication in the Fourier domain.
        c_fft = torch.fft.rfft(self.first_column, n=self.size)
        x_fft = torch.fft.rfft(x, n=self.size)
        y = torch.fft.irfft(c_fft * x_fft, n=self.size)

        if self.bias is not None:
            y = y + self.bias
        return y
```

The trainable vector `first_column` defines the entire weight matrix. PyTorch's automatic differentiation still works normally because the FFT operations are differentiable.

[Cheng et al.](https://arxiv.org/abs/1502.03436) explored this idea in neural networks by replacing dense projections with circulant ones. For a square layer, the storage drops from $$O(n^2)$$ to $$O(n)$$ and the multiplication from $$O(n^2)$$ to $$O(n\log n)$$.

The compression is impressive, but the restriction is strong. Every row contains the same values in a different order. For some transformations this is exactly what we want; for others, one circulant matrix is simply not expressive enough.

So how can we keep the fast structure while giving the model more freedom?

## Increasing Expressivity

There is no single best structured matrix. Different families make different compromises between parameter count, computational cost, and expressivity.

One simple strategy is to combine structured matrices. For example, the [ACDC layer](https://arxiv.org/abs/1511.05946) alternates learned diagonal matrices with a fixed discrete cosine transform. One block has the form

$$
y = A C D C^{-1}x,
$$

where $$A$$ and $$D$$ are learned diagonal matrices and $$C$$ is the discrete cosine transform. The diagonal matrices rescale coordinates, while the cosine transforms repeatedly mix them. Stacking several blocks creates a much richer transformation without returning to a fully dense matrix.

Another strategy is to loosen the definition of Toeplitz structure itself. This leads to **low-displacement-rank matrices**.

Instead of asking whether a matrix $$M$$ is exactly Toeplitz, we apply a displacement operator:

$$
\nabla_{A,B}(M) = AM - MB.
$$

For suitable shift matrices $$A$$ and $$B$$, a Toeplitz matrix produces a result with very low rank. Intuitively, shifting the rows and shifting the columns mostly cancel each other; only the boundaries remain different.

If

$$
AM-MB = GH^\top
$$

with $$G,H \in \mathbb{R}^{n \times r}$$ and a small $$r$$, we say that $$M$$ has displacement rank $$r$$. Increasing $$r$$ gives the layer more freedom while preserving much of the original structure.

This framework is useful because it connects several classical families—including Toeplitz, Hankel, Vandermonde, and Cauchy-like matrices—under one idea. [Sindhwani et al.](https://arxiv.org/abs/1510.01722) used this continuum to build compact neural-network layers for mobile speech recognition.

You do not need the full theory of displacement operators to understand the practical point: structure does not have to be all or nothing. We can gradually spend more parameters to gain more expressivity.

## Kronecker Products: Building a Large Matrix From Small Ones

Toeplitz and circulant matrices create structure by repeating values. Kronecker products take a different approach: they assemble a large matrix from smaller matrices.

Given matrices $$A$$ and $$B$$, their Kronecker product is

$$
A \otimes B =
\begin{pmatrix}
a_{11}B & \cdots & a_{1q}B \\
\vdots & \ddots & \vdots \\
a_{p1}B & \cdots & a_{pq}B
\end{pmatrix}.
$$

For example, if both $$A$$ and $$B$$ are $$2 \times 2$$, their Kronecker product is $$4 \times 4$$. The large matrix contains 16 entries, but it is described by the 8 entries in $$A$$ and $$B$$.

The saving becomes much larger as the matrices grow. Suppose $$A$$ is $$p \times p$$, $$B$$ is $$q \times q$$, and $$n=pq$$. Then $$A\otimes B$$ defines an $$n \times n$$ matrix using only

$$
p^2+q^2
$$

parameters instead of $$n^2=p^2q^2$$.

Again, we should not build the large matrix explicitly. If we reshape $$x$$ into a matrix $$X$$, we can use the identity

$$
(A\otimes B)\operatorname{vec}(X)
= \operatorname{vec}(BXA^\top).
$$

The large multiplication becomes two much smaller dense multiplications. When $$p\approx q\approx\sqrt{n}$$, both storage and computation become sub-quadratic.

A single Kronecker product is quite restrictive, so practical layers often learn a sum of several products. [Zhou and Wu](https://arxiv.org/abs/1507.05775), for example, replaced fully connected weights with sums of Kronecker products and reported a 73% reduction in total parameters on one SVHN model with a modest increase in error.

## Butterfly Matrices: Learning a Fast Algorithm

The FFT is fast because it does not treat the Fourier matrix as an arbitrary dense matrix. It breaks the transformation into a sequence of sparse stages.

A **Butterfly matrix** makes this computation pattern learnable.

Suppose $$n$$ is a power of two. A Butterfly transformation contains $$\log_2 n$$ stages. At each stage, pairs of values are mixed using small $$2 \times 2$$ matrices. The pairs become farther apart from one stage to the next, allowing information to move across the entire vector.

We can write the complete transformation as

$$
W = B_{\log_2 n} \cdots B_2 B_1,
$$

where each $$B_k$$ is sparse. Applying one stage costs $$O(n)$$, and there are $$O(\log n)$$ stages, so the complete multiplication costs $$O(n\log n)$$.

There is a subtle but important correction to make here. Each stage contains $$n/2$$ small $$2\times2$$ blocks—not fewer and fewer blocks as the stages progress. A generic Butterfly layer therefore uses approximately $$2n\log_2 n$$ scalar parameters. That is still far smaller than $$n^2$$, but it is $$O(n\log n)$$ rather than $$O(n)$$.

Why is this structure interesting? Because it does not assume in advance that the useful transformation is a convolution. It assumes that the transformation can be built through a divide-and-conquer computation similar to the FFT.

[Dao et al.](https://proceedings.mlr.press/v97/dao19a.html) showed that this parameterization could learn several classical fast transforms, including the FFT. In one CIFAR-10 experiment, a Butterfly replacement used 40 times fewer parameters and ran 4 times faster than the dense layer while improving classification accuracy by 3.9 points. These are results for a specific experimental setup, not a guarantee that every dense layer can be replaced this way, but they demonstrate that strong structure does not always mean worse accuracy.

## Monarch Matrices: Designing for GPUs

Butterfly matrices have attractive asymptotic complexity. Their many small sparse operations, however, are not always the operations that GPUs execute most efficiently.

This is the motivation behind **Monarch matrices**. Rather than using many fine-grained sparse stages, Monarch uses two block-diagonal matrices separated by a fixed permutation.

For $$n=m^2$$, we can write a Monarch matrix as

$$
M = P L P^\top R,
$$

where $$L$$ and $$R$$ each contain $$m$$ dense blocks of size $$m\times m$$, and $$P$$ is a fixed reshape-and-transpose permutation.

The operation is easier to picture as four steps:

1. split the vector into $$m$$ groups and apply the dense blocks in $$R$$;
2. reshape the result into an $$m\times m$$ grid and transpose it (the $$P^\top$$ operation);
3. split it into groups again and apply the dense blocks in $$L$$;
4. undo the permutation with $$P$$.

The permutation lets information from one group reach other groups, while the block multiplications map neatly to batched dense operations. GPUs are very good at those.

Each block-diagonal matrix contains $$m^3=n\sqrt{n}$$ parameters, so the two together contain approximately

$$
2n\sqrt{n}
$$

parameters. This is more than a circulant or Butterfly matrix, but still much less than $$n^2$$. That extra freedom is deliberate: Monarch gives up some theoretical compression to obtain a more favorable balance between expressivity and real hardware utilization.

In their [2022 paper](https://proceedings.mlr.press/v162/dao22a.html), Dao et al. reported roughly 2× training speedups for GPT-2 and Vision Transformer experiments with comparable model quality. They also introduced an analytical projection from a dense matrix to a Monarch matrix, which makes the structure useful for compressing an existing model rather than only training a new one from scratch.

## Comparing the Different Structures

The table below summarizes the main trade-offs for a square $$n\times n$$ matrix. The exact constants depend on the parameterization and implementation, but the orders of growth are useful.

| Matrix | Parameters | Matrix-vector multiplication | Main idea |
|---|---:|---:|---|
| Dense | $$n^2$$ | $$O(n^2)$$ | Every entry is independent |
| Rank-$$r$$ | $$2nr$$ | $$O(nr)$$ | Product of two thin matrices |
| Toeplitz | $$2n-1$$ | $$O(n\log n)$$ | Values repeat along diagonals |
| Circulant | $$n$$ | $$O(n\log n)$$ | Circular convolution via FFT |
| Kronecker | $$p^2+q^2$$, $$n=pq$$ | $$O(n(p+q))$$ | Large matrix built from two small ones |
| Butterfly | $$O(n\log n)$$ | $$O(n\log n)$$ | Product of sparse mixing stages |
| Monarch | $$O(n\sqrt{n})$$ | $$O(n\sqrt{n})$$ | Block-diagonal products plus permutation |

Low-rank matrices are included because they are probably the most familiar structured parameterization. If $$W=UV$$ with $$U\in\mathbb{R}^{n\times r}$$ and $$V\in\mathbb{R}^{r\times n}$$, the intermediate dimension $$r$$ controls the trade-off. LoRA uses this basic idea for parameter-efficient adaptation, although it adds a low-rank update to a frozen dense weight rather than replacing the dense weight entirely.

The table also reveals something important: **more compression is not automatically better**. A circulant matrix is extremely compact, but it may be too restrictive. Monarch uses more parameters, but those parameters may buy both accuracy and better GPU utilization.

## When Does the Speedup Become Real?

So far, we have counted parameters and arithmetic operations. That is necessary, but it is not enough.

A dense matrix multiplication may perform more operations, yet modern GPUs have spent decades becoming exceptionally good at it. Dense GEMM kernels use large, regular blocks of memory and keep thousands of arithmetic units busy. A theoretically cheaper structured operation may involve reshapes, FFT launches, small kernels, or irregular memory access.

As a result, an $$O(n\log n)$$ layer can be slower than an $$O(n^2)$$ dense layer for small values of $$n$$.

Here are the practical questions I would ask before replacing a dense layer:

- **Is memory the bottleneck?** If so, fewer parameters can help even without a faster kernel.
- **Is the matrix large enough?** FFT and kernel-launch overheads need to be amortized.
- **What is the batch size?** Matrix-vector and matrix-matrix workloads behave differently on a GPU.
- **Does the framework have an optimized implementation?** Constructing the dense matrix first removes most of the benefit.
- **Can the structure represent the transformation the model needs?** Compression is not useful if accuracy collapses.
- **Was the layer tuned as a new parameterization?** Initialization and learning rate can matter substantially.

That last point is easy to underestimate. A structured layer changes how a parameter update affects the complete matrix. Reusing the initialization and learning rate from a dense layer is not always fair. A [2024 study](https://openreview.net/forum?id=ExHTFXEhc9) found that different structures can require very different initialization scales and learning rates, especially as models grow.

There is also a difference between **compressing a pretrained model** and **training a structured model from scratch**. Projecting a dense weight into a restrictive family can discard useful information. Training with the structure from the beginning gives the surrounding layers time to adapt, but it changes the optimization problem.

In practice, structured matrices also combine naturally with other compression techniques. We can quantize their parameters, prune parts of the model, or distill a dense model into a structured student. The techniques solve different problems, so they do not have to compete.

## Which Structure Should We Use?

There is no universal answer, but the inductive bias gives us a useful starting point.

- If the transformation should behave like a convolution, Toeplitz or circulant structure is a natural choice.
- If a dense weight already appears close to low-rank, a low-rank factorization is simple and well supported.
- If the dimensions factor conveniently and we want to preserve multi-dimensional interactions, a sum of Kronecker products can work well.
- If we want a flexible family of fast transforms, Butterfly matrices are an interesting option.
- If actual GPU throughput is the priority, block-based structures such as Monarch deserve attention.

The right comparison is not just parameter count. It is validation quality at a fixed memory budget, training budget, or latency target.

## Conclusion

Structured matrices start from one simple observation: a neural-network layer may not need every weight to be independent.

Toeplitz and circulant matrices share values and turn multiplication into convolution. Kronecker products build large transformations from small ones. Butterfly matrices learn a sequence of sparse mixing stages, while Monarch matrices trade some compression for operations that better match modern GPUs.

The central trade-off is always the same:

$$
\text{efficiency} \quad \longleftrightarrow \quad \text{expressivity}.
$$

What I find most interesting is that the matrix and its algorithm are designed together. We are not only asking *what transformation should the model learn?* We are also asking *what transformations can our hardware apply efficiently?*

Dense matrices remain a very strong default. But as models grow, spending $$n^2$$ parameters and operations on every linear map becomes increasingly difficult to justify. Sometimes, a little mathematical structure is exactly the constraint we need.

## Further Reading

- [Structured Transforms for Small-Footprint Deep Learning](https://arxiv.org/abs/1510.01722), by Sindhwani, Sainath, and Kumar (2015)
- [An Exploration of Parameter Redundancy in Deep Networks With Circulant Projections](https://arxiv.org/abs/1502.03436), by Cheng et al. (2015)
- [ACDC: A Structured Efficient Linear Layer](https://arxiv.org/abs/1511.05946), by Moczulski et al. (2015)
- [Compression of Fully-Connected Layer in Neural Network by Kronecker Product](https://arxiv.org/abs/1507.05775), by Zhou and Wu (2015)
- [Learning Fast Algorithms for Linear Transforms Using Butterfly Factorizations](https://proceedings.mlr.press/v97/dao19a.html), by Dao et al. (2019)
- [Monarch: Expressive Structured Matrices for Efficient and Accurate Training](https://proceedings.mlr.press/v162/dao22a.html), by Dao et al. (2022)
- [Compute Better Spent: Replacing Dense Layers With Structured Matrices](https://openreview.net/forum?id=ExHTFXEhc9), by Qiu et al. (2024)
