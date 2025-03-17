---
layout: archive
title: "Digital Signal Processing (ECE 251A)"
author_profile: true
---

---
### Table of Contents
> - [LTI Systems](#lti-systems)
> - [Random Signals](#random-signals)
> - [RP Modelling](#rp-modelling)
> - [Estimation](#estimation)
> - [Prediction](#prediction)
> - [Levinson-Durbin Algorithm](#levinson-durbin-algorithm)
</br>

This class is taught by [Prof. Florian Meyer](https://fmeyer.ucsd.edu/) and we talked about some fundamental concepts in DSP that are expected from a graduate student. I took this class when I was a third-year undergraduate student. It was definitely one of the toughest courses I have ever taken, mainly due to concurrently taking a [Graduate Linear Algebra (ECE 269)](ece269.md) class too.  

# LTI Systems

# Random Signals

# RP Modelling

# Estimation

# Prediction

## Forward Linear Prediction
Given a discrete-time signal $x[n]$, the forward linear predictor estimates the current sample $x[n]$ as a linear combination of its past $p$ samples:
$$\hat{x}[n] = \sum_{k=1}^{p} a_k x[n-k]$$

where $\{a_k\}$ are the prediction coefficients.

The forward prediction error is:
$$e_f[n] = x[n] - \hat{x}[n] = x[n] - \sum_{k=1}^{p} a_k x[n-k]$$

The coefficients $a_k$ are found by minimizing the mean squared error:
$$
E = E\{ e_f^2[n] \} = E\{ (x[n] - \sum_{k=1}^{p} a_k x[n-k])^2 \}
$$
Expanding the expectation,
$$
E = E\{ x^2[n] \} - 2 \sum_{k=1}^{p} a_k E\{ x[n] x[n-k] \} + \sum_{k=1}^{p} \sum_{j=1}^{p} a_k a_j E\{ x[n-k] x[n-j] \}
$$
Using the autocorrelation function $R(m) = E\{ x[n] x[n-m] \}$,
$$
E = R(0) - 2 \sum_{k=1}^{p} a_k R(k) + \sum_{k=1}^{p} \sum_{j=1}^{p} a_k a_j R(k-j)
$$
Setting the derivative with respect to $a_m$ to zero,
$$
\frac{\partial E}{\partial a_m} = -2R(m) + 2 \sum_{k=1}^{p} a_k R(m-k) = 0
$$
which leads to the **Yule-Walker equations**:
$$
\sum_{k=1}^{p} R(m-k) a_k = -R(m), \quad m = 1,2,\dots, p
$$
where $R(m)$ is the autocorrelation function of $x[n]$.

## Backward Linear Prediction
The backward linear predictor estimates the past sample $x[n-p]$ using future samples:
$$
\hat{x}_b[n-p] = \sum_{k=1}^{p} b_k x[n-k]
$$
The backward prediction error is:
$$
e_b[n-p] = x[n-p] - \sum_{k=1}^{p} b_k x[n-k]
$$
Backward prediction coefficients $b_k$ satisfy a similar set of Yule-Walker equations.

# Levinson-Durbin Algorithm
The **Levinson-Durbin recursion** is an efficient method for solving the Yule-Walker equations for linear prediction coefficients. Given autocorrelation values $R(0), R(1), ..., R(p)$, the recursion computes $a_k$ iteratively.

### Step 1: Initialization
$$
a_1^{(1)} = -\frac{R(1)}{R(0)}
$$
$$
E_1 = (1 - |a_1^{(1)}|^2) R(0)
$$

### Step 2: Iteration for $k = 2, 3, ..., p$
For each order $k$:
$$k_k = \frac{R(k) - \sum_{j=1}^{k-1} a_j^{(k-1)} R(k-j)}{E_{k-1}}$$
$$a_j^{(k)} = a_j^{(k-1)} + k_k a_{k-j}^{(k-1)}, \quad j = 1, 2, ..., k-1$$
$$a_k^{(k)} = k_k$$
$$E_k = (1 - k_k^2) E_{k-1}$$
where $k_k$ is the **reflection coefficient** at stage $k$.

### Step 3: Output
After $p$ iterations, the final coefficients $a_1^{(p)}, a_2^{(p)}, ..., a_p^{(p)}$ are the desired linear prediction coefficients.
