---
layout: post
title: The Number of Wasted Parking Spaces Caused by Random Parking
date: 2024-09-29 00:00:00 +0000
description: Estimating the number of wasted parking spaces caused by random parking.
tags:
categories: math
giscus_comments: true
---


Imagine a long parking lot with $$n$$ parking spots arranged in a row, where each car occupies two adjacent spots. The cars arrive and park at random, choosing a pair of adjacent spots without any coordination. As more cars park, some spaces inevitably become isolated, making it impossible to park any more cars. This random process leaves a portion of the parking spots unusable, even though they are technically unoccupied. 

In this blog, we will explore how the number of free spots,  $$X_n$$ , behaves as the number of parking spots $n$ grows, and estimate the inefficiency compared to an optimal parking strategy.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/blog_parking/gif1.gif" title="parking animation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Animation of the parking process
</div>

Let's call $$I_{n, k}$$ the event: "the first car parks in spot $$k$$" (hence occupying spots $$k$$ and $$k+1$$).

Since the first car parks at exactly one spot, we can write:
$$1 = \sum_{k=1}^{n-1} \mathbf{1}_{I_{n, k}} $$
 and 
$$
X_n =  \sum_{k=1}^{n-1} X_n \mathbf{1}_{I_{n, k}}
$$

The goal of this article is to study the behavior of $$u_n = \mathbb{E}[X_n]$$ as $$n$$ grows.

$$
\begin{align*}
\mathbb{E}[X_n] &=  \sum_{k=1}^{n-1} \mathbb{E}[X_n \mathbf{1}_{I_{n, k}}] \\
&= \sum_{k=1}^{n-1} \sum_{j=1}^{n-1} j \mathbb{P}(X_n \mathbf{1}_{I_{n, k}} =j) \\
\end{align*}
$$

Since $$\{X_n \mathbf{1}_{I_{n, k}} = j\} = \{X_n =j\} \cap I_{n, k}$$, we can write:

$$
\mathbb{P}(X_n \mathbf{1}_{I_{n, k}} =j) = \mathbb{P}(X_n =j| I_{n,k}) \mathbb{P}(I_{n, k}) = \frac{1}{n-1} \mathbb{P}(X_n = j | I_{n, k})
$$

Injecting this into the equation above, we get:

$$
\mathbb{E}[X_n \mathbf{1}_{I_{n, k}}] = \frac{1}{n-1} \sum_{j=1}^{n-1} j \mathbb{P}(X_n = j | I_{n, k}) = \frac{1}{n-1} \mathbb{E}[X_n | I_{n, k}]
$$

Now, we need to compute $$\mathbb{E}[X_n | I_{n, k}]$$.

This is the expected number of free spots at the end of the parking process, given that the first car parks at spot $$k$$. We can actually see the parking lane as two separate lanes, one to the left of spot $$k$$ and one to the right of spot $$k+1$$. The expected number of free spots on the left is $$u_{k-1}$$ (there are $$k-1$$ spots on the left after the first car parks), and the number of free spots on the right is $$u_{n-k-1}$$ (there are $$n-k-1$$ spots on the right after the first car parks).

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/blog_parking/img1.png" title="parking animation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Illustration of the derived formula
</div>

Therefore, we can write:

$$
\mathbb{E}[X_n | I_{n, k}] = u_{k-1} + u_{n-k-1}
$$

So, we have:

$$
u_n = \frac{1}{n-1} \sum_{k=1}^{n-1} \mathbb{E}[X_n |\mathbf{1}_{I_{n, k}}] = \frac{1}{n-1} \sum_{k=1}^{n-1} (u_{k-1} + u_{n-k-1}) = \frac{2}{n-1} \sum_{k=1}^{n-1} u_{k-1} = \frac{2}{n-1} \sum_{k=1}^{n-2} u_k
$$

Note that the last equality comes from the fact that $$u_{0} = \mathbb{E}[X_0] = 0$$, because there are no free spots when there are no parking spots.

We can now write the recursive formula for $$u_n$$:

$$
\boxed{u_n = \frac{2}{n-1} \sum_{k=1}^{n-2} u_k}
$$

One method to deal with such a recursive formula is to study the generating function of the sequence $$u_n$$. We define the generating function as:

$$
g(z) = \sum_{n=0}^{\infty} u_n z^n
$$

The radius of convergence $$R$$ of this series is defined as the supremum of the set of real numbers $$r$$ such that the series converges for $$|z| < r$$.

Since

$$
|g(z)| \leq \sum_{n=0}^{\infty} |u_n| |z|^n \leq \sum_{n=0}^{\infty} n|z|^n 
$$

the series converges for $$|z| < 1$$, and the radius of convergence verifies $$R \geq 1$$.

Let's consider $$z \in (-1, 1)$$.

We want to leverage the recursive formula of $$u_n$$ to express $$g(z)$$. Since one term $$u_k$$ can be expressed as a weighted sum of the previous terms, we are motivated to use Cauchy's product to make the sum appear in the formula. Here is one way to do it:

$$
\begin{align*}
\left(\sum_{p=0}^{\infty} z^p \right) \left( \sum_{q=0}^{\infty} u_q z^q \right)
&= \sum_{n=0}^{\infty} \left( \sum_{k=0}^{n} u_k \times 1 \right) z^n \\
&= \sum_{n=0}^{\infty} \left( \sum_{k=0}^{n} u_k \right) z^n \\
&= \sum_{n=0}^{\infty} \frac{(n+1)u_{n+2}}{2} z^n
\end{align*}
$$

This is very convenient because we know that $$\sum_{p=0}^{\infty} z^p = \frac{1}{1-z}$$, so multiplying each side of the equation by $$2z^2$$ and noting that $$u_0 = u_1 = 0$$, we get:

$$
\begin{align*}
\frac{2z^2}{1-z} g(z) &= \sum_{n=0}^{\infty} (n+1)u_{n+2} z^{n+2} \\
&= \sum_{n=0}^{\infty} (n+2)u_{n+2} z^{n+2} - \sum_{n=0}^{\infty} u_{n+2} z^{n+2} \\
&= \sum_{n=0}^{\infty} (n+2)u_{n+2} z^{n+2} - \sum_{n=0}^{\infty} u_{n} z^{n} \\
&= z \sum_{n=0}^{\infty} (n+2)u_{n+2} z^{n+1} - g(z) \\
&= z \sum_{n=0}^{\infty} (n+1)u_{n+1} z^{n} - g(z) \\
&= z g'(z) - g(z)
\end{align*}
$$

This gives us a differential equation for $$g(z)$$, for $$z \in (-1, 1)$$:

$$
\boxed{zg'(z) = g(z) + \frac{2z^2}{1-z}g(z)}
$$

Let's try to find a candidate solution for this differential equation. Suppose that $$z > 0$$, then we can write:

$$
g'(z) = (\frac{1}{z} + \frac{2z}{1-z})g(z)
$$

We define $$f(z) = \frac{1}{z} + \frac{2z}{1-z}$$, and we know that solutions have the form 
$$
g(z) = \alpha \exp(\int f(z) dz) + \beta
$$

We can compute the integral of $$f(z)$$:

$$
\begin{align*}
\int f(z) dz &= \int \left(\frac{1}{z} + \frac{2z}{1-z} \right) dz \\
&= \int \left(\frac{1}{z} -2 + \frac{2}{1-z} \right) dz \\
&= \log(z) - 2z - 2 \log(1-z) + C
\end{align*}
$$

Therefore, the general solution of the differential equation is of the form:

$$
g(z) = \alpha \exp(-2z) \frac{z}{(1-z)^2} + \beta
$$

We verify that this is also solution of the equation for all $$z \in (-1, 1)$$ by checking that the derivative of the function satisfies the differential equation. Since $$\beta = g(0) = u_0 = 0$$ and calculating $$g'(z)$$ gives $$0 = u_1 = g'(0) = \alpha \left[ \exp(-2 \times 0) \frac{1+0}{(1-0)^3}-2\exp(-2 \times 0) \frac{0}{(1-0)^2} \right] = \alpha$$.

Therefore,

$$
\boxed{g(z) = \exp(-2z) \frac{z}{(1-z)^2} = \sum_{n=0}^{\infty} u_n z^n}
$$

It's time for more Cauchy products! Remember that:

$$
z\exp(-2z) = z\sum_{n=0}^{\infty} \frac{1}{n!}(-2z)^n = \sum_{n=0}^{\infty} \frac{1}{n!}(-2)^n z^{n+1}
$$

and

$$
\frac{1}{(1-z)^2} = \frac{d}{dz}\left( \frac{1}{1-z} \right) = \frac{d}{dz}\left( \sum_{n=0}^{\infty} z^n \right) = \sum_{n=0}^{\infty} (n+1)z^n
$$

Define $$a_{n+1} = \frac{1}{n!}(-2)^n$$ and $$b_n = n+1$$, then we have, for $$n \geq 1$$:

$$
\begin{align*}
u_n &= \sum_{k=0}^{n} a_{k+1}b_{n-k-1} \\
&= \sum_{k=0}^{n} \frac{1}{k!}(-2)^k (n-k) \\
&= n\sum_{k=0}^{n} \frac{1}{k!}(-2)^k - \sum_{k=0}^{n} \frac{1}{(k-1)!}(-2)^k \\
&= n\sum_{k=0}^{n} \frac{1}{k!}(-2)^k + 2\sum_{k=0}^{n-1} \frac{1}{k!}(-2)^k \\
&= n \left( e^{-2} - \sum_{k=n+1}^{\infty} \frac{1}{k!}(-2)^k \right) + 2\left( e^{-2} - \sum_{k=n}^{\infty} \frac{1}{k!}(-2)^k \right) \\
&= n \left( e^{-2} + O\left(\frac{1}{(n+1)!}\right) \right) + 2\left( e^{-2} + o\left( 1 \right) \right) \\
&= (n+2)e^{-2} + O\left(\frac{1}{n!}\right) + o(1) \\
&= \frac{n}{e^2} + \frac{2}{e^2} + o(1) \\

\end{align*}
$$

Finally, we conclude that:

$$
\boxed{u_n = \frac{n}{e^2} + \frac{2}{e^2} + o(1)}
$$

and

$$
\boxed{u_n \sim \frac{n}{e^2}}
$$

Conclusion: the proportion of "wasted" spots in the parking lot tends to $$1/e^2 \approx 13.5\%$$ if people park randomly. That's why you should always be careful when parking your car!




