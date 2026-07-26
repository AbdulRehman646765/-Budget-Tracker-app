Meri Next.js + TypeScript Budget Tracker app mein complete Banking Style PIN Lock System implement karo.

⚠️ **Sab se important baat:** Meri app ka existing **UI/UX aur design bilkul change nahi hona chahiye.** Colors, spacing, layout, cards, animations aur styling jaisi abhi hai waisi hi rehni chahiye. Sirf naye features add karo. Koi existing design ya layout break nahi hona chahiye.

### 1. PIN Setup

* 4-digit PIN system implement karo.
* PIN localStorage mein save ho.
* Agar PIN pehle se set hai to header ka lock button "Disable PIN" open kare.
* Agar PIN set nahi hai to lock button "Setup PIN" open kare.
* Existing `PinLockOverlay` component hi reuse karo.

---

### 2. App Open Hone Par

Jab app open ho:

* Agar PIN set hai to foran `PinLockOverlay` unlock mode mein show ho.
* Jab tak correct PIN enter na ho user app use na kar sake.

Agar PIN set nahi hai to unlock overlay show na ho, lekin app restricted mode mein rahe.

---

### 3. Restricted Mode

Jab tak PIN set na ho:

* Har financial amount hide ho.
* Sab amount ki jagah sirf

---

show ho.

Ismein sab kuch include ho:

* Summary Cards
* Result Summary
* Budget History
* Custom Expenses
* Monthly Comparison
* Donut Chart
* Smart Insights
* Calendar
* Subscriptions
* Badges
* Totals
* Remaining
* Income
* Expense

Har financial value hide honi chahiye.

---

### 4. Locked Sections

Sensitive sections ki jagah professional lock screen show karo.

Examples:

* Chart Locked
* History Locked
* Comparison Locked
* Calendar Locked
* Insights Locked
* Subscriptions Locked

Har section mein lock icon, title aur short message ho.

Ek reusable `LockedSection` component banao aur har jagah wahi use karo. Duplicate code mat likho.

---

### 5. PIN Ke Baghair Koi Action Na Ho

Jab tak PIN set na ho user kuch bhi modify na kar sake.

Examples:

* Add Expense
* Edit
* Delete
* Save Budget
* Add Subscription
* Delete Subscription
* Add Category
* Delete Category
* Export CSV
* Export PDF
* Clear All
* History Edit
* History Delete

Buttons ko sirf disable mat karo.

Agar user click kare to toast ya alert show karo:

**"Please set your PIN first."**

---

### 6. Inputs Lock

PIN set na ho to saare inputs readonly ho jayein.

Examples:

* Salary
* Goal
* Expenses
* Category
* Subscription Form
* Custom Expense Form

Sab editable na hon.

---

### 7. Global Hide Logic

Ek hi global variable use karo.

Example:

```ts
const hideAmounts = !pinEnabled || !isUnlocked;
```

Isi ko saare components mein pass karo.

Har component mein alag logic mat banao.

---

### 8. Existing PinLockOverlay

Mera existing `PinLockOverlay` hi use karo.

Uske teen modes support rehne chahiye:

* unlock
* setup
* disable

Usko rewrite mat karo jab tak zarurat na ho.

---

### 9. Disable PIN

Disable PIN karte waqt current PIN verify karo.

Correct ho to:

* localStorage se PIN remove karo.
* App restricted mode mein wapas aa jaye.

---

### 10. Unlock Flow

App Open

↓

PIN Screen

↓

Correct PIN

↓

App Unlock

↓

Sab amounts visible

↓

Sab buttons kaam karein

↓

Charts aur History show ho jaye.

---

### 11. Code Quality

* Existing functionality break na ho.
* Existing UI aur design bilkul same rahe.
* Kisi component ki styling ya layout unnecessarily change na karo.
* Existing CSS classes ko hi reuse karo jahan possible ho.
* Clean reusable components use karo.
* TypeScript errors na hon.
* Duplicate code avoid karo.
* Production-ready implementation likho.
* Har affected component ko update karo.
* Jahan zarurat ho complete updated code provide karo.
* Final implementation aisi ho ke app pehle jaisi hi lage, sirf naye security features add ho jayein.
