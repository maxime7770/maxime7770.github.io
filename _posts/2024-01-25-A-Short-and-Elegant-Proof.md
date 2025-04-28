---
layout: post
title: A Short and Elegant Proof
date: 2025-01-25 00:00:00 +0000
description:
tags:
categories: math
giscus_comments: true
font: "Merriweather, serif"
---


> **Theorem**: there does not exist a set that contains all sets.

By contradiction, suppose that such a set exists and call it $$E$$. Then it would include $$\mathcal{P}(E)$$ (all subsets of $$E$$) i.e. there would be an injection $$g$$ from $$\mathcal{P}(E)$$ to $$E$$. So there would also be a surjection $$f$$ from $$E$$ to $$\mathcal{P}(E)$$ because every element $$x$$ of $$\mathcal{P}(E)$$ could have as (unique) antecedent $$g(x)$$.

Define $$D = \{x \in E \mid x \notin f(x)\} \in \mathcal{P}(E)$$. Since $$f$$ is surjective, $$\exists y \in E; f(y) = D$$. Now, we have two cases:
- If $$y \in D$$, then $$y \notin f(y) = D$$
- If $$y \notin D$$, then $$y \in f(y) = D$$

We have a contradiction in both cases. Therefore, the assumption that there exists a set containing all sets is false.
Thanks to Cantor for this proof! :smile: