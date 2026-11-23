---
layout: post
title: Probabilistic Inference through Babies
date: 2026-11-23
description: >
  Babies explain probabalistic inference.
tags: [probability, inference, quantum error correction]
hide_description: true
---

Suppose you have done time travel, and you are now a baby again (I will assume you were an intelligent one, which I believe everyone is). One day, a beautiful Sunday, you are having a playdate with your 3 friends, let's call you Skipper and them Kowalski, Private, and Rico (these names should be familiar), and all of you are coloring on one notebook. Your friends are also the same age as you. All of you are using the same color crayon (red) to color a notebook. Suddenly you feel the urge to pee (with poo), and you are also man enough to not tell mom and go to the bathroom to relieve yourself. When you come back you see all shapes on your page rather than colored characters. All your 3 friends tell that the other ones did it and not them. Now being the intelligent baby you are, you somehow know that only one of them drew all these shapes (we are assuming this to keep the problem simple for now, we will cover other versions later like if more than one baby did, then how much did one baby do). With all the past information now that you have of your friends, you have to infer which one of them ruined your page. This process is called inference, and since you are going to use probabilities to figure out who did it, this field is called probabilistic inference.

Now we have assumed that you were more intelligent than all of them, so you know something about their writing patterns. What you know is that Kowalski generally draws a shape like the letter "I", Rico generally draws a shape like the letter "c", and Private generally draws a shape like the letter "s". So now you have nine pieces of information. For example, $$p(\text{"I"} \mid \text{Kowalski})$$ means the probability that the shape is an "I" given that Kowalski drew it, and $$p(\text{"I"} \mid \text{Rico})$$ means the probability that the shape is an "I" given that Rico drew it. The nine pieces are:

$$
\begin{aligned}
&p(\text{"I"} \mid \text{Kowalski}), \quad p(\text{"s"} \mid \text{Kowalski}), \quad p(\text{"c"} \mid \text{Kowalski})\\[4pt]
&p(\text{"I"} \mid \text{Rico}), \quad\;\; p(\text{"s"} \mid \text{Rico}), \quad\;\; p(\text{"c"} \mid \text{Rico})\\[4pt]
&p(\text{"I"} \mid \text{Private}), \quad p(\text{"s"} \mid \text{Private}), \quad p(\text{"c"} \mid \text{Private})
\end{aligned}
$$

Now since we said generally and not always, that means even Kowalski can slip once in a blue moon and draw a curve (nobody is perfect, not even a baby), so instead of saying he always draws "I", let us just put some numbers on how much each of them likes each shape, something like this:

|          | "I" | "s" | "c" |
| -------- | :-: | :-: | :-: |
| Kowalski | 0.8 | 0.1 | 0.1 |
| Rico     | 0.1 | 0.1 | 0.8 |
| Private  | 0.1 | 0.8 | 0.1 |

This whole table gives us the **Likelihood** (the probabilities of what someone will draw), which simply tells us how probable a particular shape is if we already know which baby drew it. Vageuly speaking for easier explanation, this table means that if Kowalski draws 100 times, 80 of the times will be "I", 10 times will be "c" and 10 times will be "s". Similary for Rico and Private. Now some must question, how do we have these probabilities already (we will come back to this some other time, for now just accept that we have this information beforehand).

But just knowing the handwriting is not enough to blame someone, you also know from before what kind of kids they are. Rico is a small devil who breaks things just for fun, Kowalski only does bad things when one of his experiments goes wrong, and Private is a sweet innocent angel who has basically never done anything bad in his whole life. So even before looking at the page, in your heart you already feel something like this:

$$
p(\text{Kowalski}) = 0.3, \qquad p(\text{Rico}) = 0.6, \qquad p(\text{Private}) = 0.1
$$

This feeling you have before seeing any proof is called the **Prior Probability**, and you can already see that right now, without any evidence at all, Rico is your number one suspect. Now don't confuse this with likelihood. Prior tells you how likely a baby is to be the culprit before seeing the shapes, while likelihood tells you how likely you are to see a particular shape if that baby is the culprit. For example, Private having an 80% likelihood of drawing an "s" does not mean he has an 80% probability of being guilty (you cannot just accuse an innocent baby like that).

Now you finally look down at your poor notebook, and you see that every single shape on the page is a curvy little "s". Uh oh, Private.

Now what you actually want is the opposite of the handwriting table. **You don't want to know what shape a baby draws, you want to know given this shape who is the one that drew it (Inference as we discussed before)**, and this flipping is exactly what Bayes' theorem does for you:

$$
p(\text{culprit} \mid \text{shape}) =
\frac{
p(\text{shape} \mid \text{culprit})
\; p(\text{culprit})
}{
p(\text{shape})
}
$$

That bottom part $$p(\text{shape})$$ is the total probability of observing that shape, and it makes everything add nicely to 1, so the real game is happening on the top, which is just likelihood times prior. The final probability we get is called the **Posterior Probability**, our updated belief after seeing the evidence. So let us calculate the top part for one single shape, which in our case is an "s":

$$
\begin{aligned}
\text{Kowalski:} &\quad
p(\text{shape} \mid \text{Kowalski})
\, p(\text{Kowalski})
= 0.1 \times 0.3 = 0.03\\
\text{Rico:} &\quad
p(\text{shape} \mid \text{Rico})
\, p(\text{Rico})
= 0.1 \times 0.6 = 0.06\\
\text{Private:} &\quad
p(\text{shape} \mid \text{Private})
\, p(\text{Private})
= 0.8 \times 0.1 = 0.08
\end{aligned}
$$

Now you add these three ($$0.03 + 0.06 + 0.08 = 0.17$$) and divide each one by this total, and you get proper probabilities:

$$
\begin{aligned}
p(\text{Kowalski}\mid \text{shape}) &\approx 18\%\\
p(\text{Rico}\mid \text{shape}) &\approx 35\%\\
p(\text{Private}\mid \text{shape}) &\approx 47\%
\end{aligned}
$$

Interesting right. The "s" is pointing towards Private, but still he is not caught yet, because Rico has such a bad reputation that he is still sitting at 35%. One small shape is simply not enough to cancel a whole life of good behaviour. This fight, between what the evidence is saying and what you already believed in your head, is the whole heart of inference.

But wait, it was never just one shape, the whole page is full of "s" shapes, let us say five of them. Remember we assumed only one baby drew all of them, and if we also assume each shape was drawn independently given that baby, then you just multiply all their likelihoods together. So the baby whose shape matches gets rewarded 5 times, and the baby whose shape does not match gets punished 5 times:

$$
\begin{aligned}
\text{Kowalski:} &\quad (0.1)^5 \times 0.3 = 0.000003\\
\text{Rico:} &\quad (0.1)^5 \times 0.6 = 0.000006\\
\text{Private:} &\quad (0.8)^5 \times 0.1 = 0.032768
\end{aligned}
$$

Now normalise again, and the verdict is very brutal:

$$
\begin{aligned}
p(\text{Kowalski} \mid \text{all five shapes})
&\approx 0.01\%\\
p(\text{Rico} \mid \text{all five shapes})
&\approx 0.02\%\\
p(\text{Private} \mid \text{all five shapes})
&\approx 99.97\%
\end{aligned}
$$

So the sweet innocent never-did-anything-wrong Private is almost certainly the one who did it. His good reputation saved him for only one shape, but a full page of his favourite "s" totally buried him. Case closed (well, 99.97% closed).

And this is the whole probabilistic inference in one short story. You take what you already believed from before (the prior), then you see how well each suspect is explaining what you are actually seeing (the likelihood), you multiply them together, normalise, and get your updated belief (the posterior). And if you give it enough evidence, it can happily catch even the least expected suspect in the room, or save the one who was looking most guilty. Picking the suspect with the highest posterior probability is called **Maximum a Posteriori (MAP) Estimation**, which in our case happens to be poor Private.

(And if one day you grow up and start building quantum computers, you will meet this same idea again. The scribbles will become something called an error syndrome, the guilty baby becomes the error that caused it, and finding the most probable error given the syndrome is called maximum a posteriori decoding. Same baby, just a much bigger notebook. This is the of the starting blog of the series that will lead to Tensor Network decoding of 3D Color Codes in Quantum Error Correction)
