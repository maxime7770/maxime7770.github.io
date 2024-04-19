---
layout: post
title: The Volume of the n-ball
date: 2024-04-19 00:00:00 +0000
description: Derivation of the formula for the volume of the n-ball.
tags: math
categories:
---

### Introduction

This post is an extension of my Medium article: *The Math Behind "The Curse of Dimensionality"*.

Here, I derive the formula for the volume of the n-ball using integral calculus and Wallis integrals.

An n-ball is a generalization of the ordinary "ball" to arbitrary dimensions. It is defined as the set of points in the n-dimensional Euclidean space that are at a fixed distance from a central point (we will condider 0, the origin). The n-ball has important applications, particulary in  machine learning and data analysis.


The equation of an n-ball is given by:

$$
x_1^2 + x_2^2 + \ldots + x_{N}^2 \leq r^2
$$

where $$r$$ is the radius of the ball.


### Derivation of the volume formula

One of the most important properties of the n-ball is its volume. The volume of an n-ball of radius $$r$$ is given by:

$$
V_N(r) = \frac{\pi^{(N+1)/2}}{\Gamma((N+1)/2)} r^{N+1}
$$

where $$\Gamma$$ is the gamma function. 
In the rest of this post, we will derive this formula.

We define the unit (radius equal to 1) n-ball as the following space: $$\mathcal{B}_n = \{x_1, \dots, x_m; \sum\limits_{i=1}^n x_i^2 \leq 1 \}$$ 

We note $$V_n = V_n(1)$$ the volume of this ball. And more generally $V_n(R)$ the volume of the n-ball with radius $R$. From now on, we will use $$V_n$$ to refer to the volume of the unit n-ball:

$$V_n = \int_{x \in \mathcal{B}_n} dx_1 dx_2\dots dx_n$$

First, note that the volume of the n-ball of radius $$R$$ is $$R^n V_n$$: simply use the change of variable $$y_i \leftarrow x_i / R $$ in the expression of $$V_n(R)$$.

Now, let’s simplify $$V_n$$:

$$
\begin{align*}
V_n &= \int_{x_1^2 + \dots + x_n^2 \leq 1} dx_1 dx_2\dots dx_n \\
 &= \int_{x_1^2 \leq 1} \left( \int_{x_2^2 + \dots + x_n^2 \leq 1 - x_1^2} dx_1 dx_2\dots dx_n \right) dx_1 \\
&=  \int_{x_1^2 \leq 1} V_{n-1}\left(\sqrt{1-x_1^2}\right) dx_1
\end{align*}
$$

We can now replace the expression of the volume of the $$n-1$$ ball of radius $$\sqrt{1-x_1^2}$$ with the previous relation:

$$
\begin{align*}
V_n &= \int_{x_1^2 \leq 1} V_{n-1}\left(\sqrt{1-x_1^2} \right) dx_1 \\
&= V_{n-1}\int_{x_1^2 \leq 1} \left(\sqrt{1-x_1^2}\right)^{n-1} dx_1 \\
&= V_{n-1}\int_{-1}^{1} (1-x^2)^{n-1} dx

\end{align*}
$$

We use the change of variable $$x = \cos(\theta)$$ (so $dx = -\sin(\theta) d\theta$) to simplify the integral:

$$
\begin{align*}
V_n &= V_{n-1}\int_{-1}^{1} (1-x^2)^{n-1} dx \\
&= -V_{n-1}\int_{\pi}^{0} \sin^{n-1}(\theta) \sin(\theta) d\theta \\
&= V_{n-1}\int_{0}^{\pi} \sin^{n}(\theta) d\theta \\
&= 2 V_{n-1}\int_{0}^{\pi/2} \sin^{n}(\theta) d\theta \\
&= I_n V_{n-1}
\end{align*}
$$

We note $$I_n = 2\int_{0}^{\pi/2} \sin^{n}(\theta) d\theta$$.

Note that $$\int_{0}^{\pi/2} \sin^{n}(\theta) d\theta$$ is a famous integral in mathematics: it is called the Wallis integral and often denoted by $$W_n$$. It can be derived using integration by parts (I will prove this formula in the [appendix](#derivation-of-the-wallis-integrals)). Depending on the parity of $$n$$, the integral can be expressed as:


$$
W_{2p} = \frac{\pi}{2} \frac{(2p)!}{2^{2p}(p!)^2}
$$
and 
$$
W_{2p+1} = \frac{2^{2p} (p!)^2}{(2p+1)!}
$$

Using our recursive relation, we know that:
$$ V_n = I_n I_{n-1} \dots I_2 V_1$$ and $$V_1 = V_1(1) = 2$$ (the length of the segment $$[-1, 1]$$ ).

We are going to make use of a very useful property:
$$
I_{2p}I_{2p+1} = 4W_{2p}W_{2p+1} = \frac{\pi}{2} \frac{(2p)!}{2^{2p}(p!)^2} \frac{2^{2p} (p!)^2}{(2p+1)!} = \frac{2\pi}{2p+1} = \frac{\pi}{p+1/2}
$$

We will also need the Gamma function. All you need to know is these 2 expressions:
$$
\Gamma(n) = (n-1)!
$$
and
$$
\Gamma(n+1/2) = (n+1/2)\times(n-1/2)\times \dots \times 1/2 \times \pi ^{1/2}
$$

Now, we can easily compute the volume $$V_n$$ by grouping successive terms, depending again on the parity of $$n$$.

If $$n = 2p$$:
$$
\begin{align*}
V_{2p} &= I_{2p}I_{2p-1} \dots I_2 V_1 \\
&= I_{2p} (I_{2p-1}I_{2p-2}) \dots (I_3I_2)\times 2 \\
&= \pi \times \frac{(2p)!}{2^{2p}(p!)^2} \times \frac{\pi}{p-1/2} \times \frac{\pi}{p-3/2}\times  \dots \times \frac{\pi}{3/2} \times \frac{\pi}{1/2} \\
&= \frac{(2p)!}{2^{p}(p!)^2} \times \frac{\pi^{p}}{(2p-1)(2p-3)\dots (1)} \\
&= \frac{\pi^{p}}{2^p} \times \frac{(2p)!}{(p!)^2} \times \frac{(2p)(2p-2)\dots (4) (2)}{(2p!)} \\
&= \frac{\pi^{p}}{2^p} \times \frac{(2p)!}{(p!)^2} \times \frac{2^p p!}{(2p)!} \\
&= \frac{\pi^p}{p!} \\
&= \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)}
\end{align*}
$$

If $$n = 2p+1$$, it is a bit less complicated:

$$
\begin{align*}
V_{2p+1} &= I_{2p+1}I_{2p}I_{2p-1} \dots I_2 V_1 \\
&= (I_{2p+1}I_{2p})(I_{2p-1}I_{2p-2}) \dots (I_3I_2)\times 2 \\
&= \frac{\pi}{p+1/2} \times \frac{\pi}{p-1/2} \times \frac{\pi}{p-3/2}\times  \dots \times \frac{\pi}{3/2} \times \frac{\pi}{1/2} \\
&= \frac{\pi^{p+\frac{1}{2}}}{(p+1/2)(p-1/2)\dots (1/2) \pi ^ {\frac{1}{2}}} \\
&= \frac{\pi^{p+\frac{1}{2}}}{\Gamma(p+\frac{1}{2} + 1)} \\
&= \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)}

\end{align*}
$$

So we obtained a single formula for the volume of the n-ball, regardless of the parity of $$n$$:

$$
V_n = V_n(1) = \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)}
$$

And by extension, the volume of the n-ball of radius $$R$$ is:

$$
\boxed{V_n(R) = R^n V_n(1) = R^n \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)}}
$$


Note that there is a very easy way to derive the area of the surface of n-ball using this expression. We simply need to derive the volume of the n-ball of radius $$R$$ with respect to $$R$$ and we obtain the surface area of the n-ball of radius $$R$$:

$$
\frac{d}{dR} V_n(R) = n R^{n-1} V_n(1) = n R^{n-1} \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)}
$$

Paricularly, the surface area of the n-ball of radius $$1$$ is:

$$
S_n = n \frac{\pi^{n/2}}{\Gamma(\frac{n}{2} + 1)} = \frac{2 \pi^{n/2}}{\Gamma(\frac{n}{2})}
$$


----

### <a name="#Wallis"></a> Appendix: Derivation of the Wallis integrals 

The Wallis integrals are defined as:

$$
W_{n} = \int_{0}^{\pi/2} \sin^{n}(\theta) d\theta
$$

We will derive a recursive formula using integration by parts.

$$
\begin{align*}
W_n &= \int_{0}^{\pi/2} \sin^{n}(\theta) d\theta \\
&= \int_{0}^{\pi/2} \sin^{n-2}(\theta) (1- \cos^2(\theta)) d\theta \\
&= W_{n-2} - \int_{0}^{\pi/2} \sin^{n-2}(\theta) \cos^2(\theta) d\theta \\
&= W_{n-2} - \left(\left[\frac{\sin^{n-1}(\theta)}{n-1}\cos(\theta) \right]_0^{\pi/2} - \frac{1}{n-1} \int_0^{\pi/2}-\sin^{n-1}(\theta)\sin(x)d\theta\right) \\
&= W_{n-2} - \frac{1}{n-1} W_{n}
\end{align*}
$$

We conclude that:

$$
W_n = \frac{n-1}{n} W_{n-2}
$$

We can now distinguish 2 cases depending on the parity of $$n$$:

- If $$n = 2p$$, we have:

$$
W_{2p} = \frac{2p-1}{2p} W_{2p-2} = \frac{2p-1}{2p} \frac{2p-3}{2p-2} \dots \frac{1}{2} W_0 = \frac{2p-1}{2p} \frac{2p-3}{2p-2} \dots \frac{1}{2} \frac{\pi}{2} = \frac{\pi}{2} \frac{(2p)!}{2^{2p}(p!)^2}
$$

We obtained the last equality by multiplying the denominator and the numerator by $$2p(2p-2)\dots 2$$ to make $$(2p)!$$ appear. We then factorized each term of the denominator by 2.

- Similarly, if $$n = 2p+1$$, we have:

$$
W_{2p+1} = \frac{2p}{2p+1} W_{2p-1} = \frac{2p}{2p+1} \frac{2p-2}{2p-1} \dots \frac{2}{3} W_1 = \frac{2p}{2p+1} \frac{2p-2}{2p-1} \dots \frac{2}{3} \frac{2}{1} = \frac{2^{2p} (p!)^2}{(2p+1)!}
$$

We conclude that 

$$
\boxed{W_{2p} = \frac{\pi}{2} \frac{(2p)!}{2^{2p}(p!)^2}}
$$

and

$$
\boxed{W_{2p+1} = \frac{2^{2p} (p!)^2}{(2p+1)!}}
$$