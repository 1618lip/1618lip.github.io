# Lecture 12 (Thu 11/09/2023)

Owner: Philip Manfred Pincencia

# Joint Statistics for $\geq 2$ random variables

> Def: The Joint CDF of random variables $X,Y$ is 

$F_{X,Y}(u,v)=P(X\leq u, Y\leq v)$
> 

*Can generalize to joint CDF of $n$ random variables:* 

$$
F_{X_1, ..., X_n}(u_1, ..., u_n)=P(X_1\leq u_1, ..., X_n\leq u_n)
$$

### Example:

Flip a fair coin twice. $S=\{HH,HT,TH,TT\}$. Define random variables $X,Y$: 

- $X=$ “# of Heads” $=\{0,1,2\}$
- $Y=$ 1 if same, 0 if different.

Hence, 

$p_X(0)=p_X(2)=\frac{1}{4}$ and $p_X(1)=\frac{1}{2}$

$p_Y(0)=p_Y(1)=\frac{1}{2}$

Calculate joint CDF of $X,Y$: 

**Case 1: $u<0$ or $v<0$**

$F_{X,Y}(u,v)=0$

**Case 2: $0\leq u<1$ and $v\geq 1$.**

$F_{X,Y}(u,v) = P(X\leq u, Y\leq v)= P(X=0, Y=\{0,1\})=P(X=0)=P(\{TT\})=\frac{1}{4}$

**Case 3: $0\leq u < 1$ and $0\leq v < 1$**

$F_{X,Y}(u,v) = P(X\leq u, Y\leq v)= P(X=0, Y=0)=P(\emptyset)=0$ 
because TT is not different 

**Case 4: $1\leq 2 < 2$ and $v\geq 1$**

$F_{X,Y}(u,v) = P(X\leq u, Y\leq v)= P(X=1, Y=\{0,1\})=P(X=1)=\frac{3}{4}$

*And continue the cases* 

<aside>
💡 Given $X,Y$. The individual CDFs $F_X(u), F_Y(v)$ are called marginal CDFS to distinguish then from joint CDF $F_{X,Y}(u,v)$

</aside>

## Get Marginal CDFS from the joint CDF

$F_{X,Y}(u,\infty) = P(X\leq u, Y\leq\infty)=P(X\leq u)=F_X(u)$

*Likewise, $F_{X,Y}(\infty,v)=F_Y(v)$* 

Def: The joint pmf of discrete random variables $X$ and $Y$ is: 

$$
p_{X,Y}(u,v) = P(X= u, Y=v)
$$

Key fact about joint pmfs is this: 

> Let $T\subseteq\mathbb{R}^2$ (region in the plane). Then, $P\left((X,Y)\in T\right)=\sum_{(u,v)\in T} p_{X,Y}(u,v)$
> 

A consequence is: 

$F_{X,Y}(a,b)=P(X\leq a, Y\leq b)=P((X,Y)\in T)$, where $T=\{(u,v): u\leq a, v\leq b\}$

$= \sum_{u\leq a, v\leq b}p_{X,Y}(u,v)$      *this gives joint CDF from joint pmf*

### Get Marginal pmfs from joint pmf

Note: $\{X=u\}=\bigcup_v \{X=u, Y=v\}$

So, $p_X(u)=P(X=u)=\sum_{v} p_{X,Y}(u,v)$      ***sum out the other variable!***

### Example

Flip a fair coin twice. $S=\{HH,HT,TH,TT\}$. Define random variables $X,Y$: 

- $X=$ “# of Heads” $=\{0,1,2\}$
- $Y=$ 1 if same, 0 if different.
1. Find joint pmf: 
$p_{X,Y}(0,1)=P(X=0, Y=1)=P(TT, TT \text{ or } HH)=P(TT)=\frac{1}{4}$
2. $p_{X,Y}(1,0)=P(X=1, Y=0)=P(HT \text{ or } TH, TH \text{ or } HT)=P(HT\cup TH)=\frac{1}{2}$
3. $p_{X,Y}(2,1)=P(X=2, Y=1)=P(HH, HH \text{ or } TT)=P(HH)=\frac{1}{4}$

Total probability is already 1, so we’re done. 

So, getting the marginal pmfs: 

$p_X(u)$: *// summing up vertically moving to the right*

- $p_X(0)=\sum_v p_{X,Y}(0,v)=p_{X,Y}(0,1)=\frac{1}{4}$
- $p_X(1)=\sum_v p_{X,Y}(1,v)=p_{X,Y}(1,0)=\frac{1}{2}$
- $p_X(2)=\sum_v p_{X,Y}(2,v)=p_{X,Y}(2,1)=\frac{1}{4}$

$p_Y(v)$: *// summing up horizontally moving up*

- $p_Y(0)=\sum_u p_{X,Y}(u,0)=p_{X,Y}(1,0)=\frac{1}{2}$
- $p_Y(1)=\sum_u p_{X,Y}(u,1)=p_{X,Y}(0,1)+p_{X,Y}(2,1)=\frac{1}{2}$

**Deduce joint pmf from marginal pmfs?** 

No. In general, there is **not a unique** joint pmf. :((((

Joint pmfs $\to$ marginal pmfs, but marginal pmfs $\not\to$ joint pmfs

## Joint pdfs

Def: A joint pdf of continuous random variable $X,Y$ is a function $f_{X,Y}(u,v)$ such that for any set $T\subseteq\mathbb{R}^2$. we get 

$$
P((X,Y)\in T)=\iint_T f_{X,Y}(u,v)~dudv
$$