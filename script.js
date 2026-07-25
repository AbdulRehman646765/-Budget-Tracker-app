// ==========================================
//  Monthly Budget Tracker — script.js
// ==========================================

// ---------- Category Colors & Icons ----------
const CATEGORIES = {
    general: { label: "General", color: "#64748b", icon: "fa-tag" },
    food: { label: "Food", color: "#f59e0b", icon: "fa-utensils" },
    bills: { label: "Bills", color: "#ef4444", icon: "fa-file-invoice-dollar" },
    health: { label: "Health", color: "#ec4899", icon: "fa-heart-pulse" },
    shopping: { label: "Shopping", color: "#8b5cf6", icon: "fa-bag-shopping" },
    education: { label: "Education", color: "#3b82f6", icon: "fa-graduation-cap" },
    entertainment: { label: "Entertainment", color: "#10b981", icon: "fa-film" },
    other: { label: "Other", color: "#6b7280", icon: "fa-ellipsis" }
};

let selectedCategory = "general";
let currentCurrency = localStorage.getItem("selectedCurrency") || "Rs.";

// ---------- Storage & State ----------
let customExpenses = JSON.parse(localStorage.getItem("customExpenses")) || [];
let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [
    { name: "Netflix", amount: 1500, dueDate: 5, status: "unpaid" },
    { name: "Wifi / Internet", amount: 2000, dueDate: 10, status: "paid" },
    { name: "Electricity Bill", amount: 4500, dueDate: 15, status: "unpaid" }
];
let budgetAlertSettings = JSON.parse(localStorage.getItem("budgetAlertSettings")) || { enabled: true, threshold: 80 };
let appPin = localStorage.getItem("appPin") || "";
let isAppLocked = localStorage.getItem("isAppLocked") === "true";
let pinInput = "";
let calendarDate = new Date();

function saveCustomExpenses() {
    localStorage.setItem("customExpenses", JSON.stringify(customExpenses));
}

function saveSubscriptions() {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
}

function getCustomExpensesTotal() {
    return customExpenses.reduce((sum, exp) => sum + exp.amount, 0);
}

// ---------- Tool Section Filtering (Dropdown & Pills) ----------
function selectToolSection(value) {
    const allTools = ["chart", "insights", "subscriptions", "calendar", "comparison", "history", "alert"];
    const select = document.getElementById("toolSelect");
    if (select) select.value = value;
    
    if (value === "all") {
        allTools.forEach(tool => {
            const card = document.getElementById(tool + "Section");
            const pill = document.querySelector(`.tool-pill[data-tool="${tool}"]`);
            if (card) card.classList.remove("hidden");
            if (pill) pill.classList.add("active");
        });
    } else if (value === "none") {
        allTools.forEach(tool => {
            const card = document.getElementById(tool + "Section");
            const pill = document.querySelector(`.tool-pill[data-tool="${tool}"]`);
            if (card) card.classList.add("hidden");
            if (pill) pill.classList.remove("active");
        });
    } else {
        allTools.forEach(tool => {
            const card = document.getElementById(tool + "Section");
            const pill = document.querySelector(`.tool-pill[data-tool="${tool}"]`);
            if (tool === value) {
                if (card) {
                    card.classList.remove("hidden");
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                if (pill) pill.classList.add("active");
            } else {
                if (card) card.classList.add("hidden");
                if (pill) pill.classList.remove("active");
            }
        });
    }
}

function toggleToolSection(tool) {
    const card = document.getElementById(tool + "Section");
    const pill = document.querySelector(`.tool-pill[data-tool="${tool}"]`);
    if (!card) return;

    if (card.classList.contains("hidden")) {
        card.classList.remove("hidden");
        if (pill) pill.classList.add("active");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        card.classList.add("hidden");
        if (pill) pill.classList.remove("active");
    }
}

// ---------- Currency Management ----------
function changeCurrency(symbol) {
    currentCurrency = symbol;
    localStorage.setItem("selectedCurrency", symbol);

    document.querySelectorAll(".curr-symbol").forEach(el => {
        el.innerText = symbol;
    });

    const select = document.getElementById("currencySelect");
    if (select) select.value = symbol;

    calculate();
    renderCustomExpenses();
    renderSubscriptions();
    renderMonthlyComparison();
    renderCalendar();
    showToast(`Currency changed to ${symbol}`);
}

// ---------- App PIN Lock Management ----------
function initPinLock() {
    const overlay = document.getElementById("pinOverlay");
    const title = document.getElementById("pinBoxTitle");
    const sub = document.getElementById("pinBoxSub");

    if (appPin !== "" && isAppLocked) {
        title.innerText = "Enter PIN";
        sub.innerText = "App is locked for your privacy";
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}

function togglePinLock() {
    if (appPin === "") {
        let newPin = prompt("Set a new 4-digit PIN for App Lock:");
        if (newPin && newPin.length === 4 && !isNaN(newPin)) {
            appPin = newPin;
            isAppLocked = true;
            localStorage.setItem("appPin", appPin);
            localStorage.setItem("isAppLocked", "true");
            showToast("PIN Lock Enabled!");
            initPinLock();
        } else if (newPin) {
            showToast("PIN must be 4 digits!", "error");
        }
    } else {
        let confirmDisable = confirm("PIN Lock is active. Would you like to disable PIN Lock?");
        if (confirmDisable) {
            let enterPin = prompt("Enter current 4-digit PIN to confirm:");
            if (enterPin === appPin) {
                appPin = "";
                isAppLocked = false;
                localStorage.removeItem("appPin");
                localStorage.setItem("isAppLocked", "false");
                showToast("PIN Lock Disabled");
                initPinLock();
            } else {
                showToast("Incorrect PIN!", "error");
            }
        }
    }
}

function pressPin(digit) {
    if (pinInput.length < 4) {
        pinInput += digit;
        updatePinDots();
    }
    if (pinInput.length === 4) {
        setTimeout(submitPin, 150);
    }
}

function clearPin() {
    pinInput = "";
    updatePinDots();
}

function updatePinDots() {
    const dots = document.querySelectorAll("#pinDots .dot");
    dots.forEach((dot, index) => {
        if (index < pinInput.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

function submitPin() {
    if (pinInput === appPin) {
        document.getElementById("pinOverlay").classList.remove("show");
        isAppLocked = false;
        localStorage.setItem("isAppLocked", "false");
        pinInput = "";
        updatePinDots();
        showToast("App Unlocked!");
    } else {
        showToast("Incorrect PIN!", "error");
        pinInput = "";
        updatePinDots();
    }
}

// ---------- Budget Alert Settings ----------
function saveAlertSettings() {
    const enabled = document.getElementById("alertToggle").checked;
    const threshold = Number(document.getElementById("alertThreshold").value) || 80;
    budgetAlertSettings = { enabled, threshold };
    localStorage.setItem("budgetAlertSettings", JSON.stringify(budgetAlertSettings));
    calculate();
}

function loadAlertSettings() {
    const toggle = document.getElementById("alertToggle");
    const threshold = document.getElementById("alertThreshold");
    if (toggle) toggle.checked = budgetAlertSettings.enabled;
    if (threshold) threshold.value = budgetAlertSettings.threshold;
}

function toggleBudgetAlert() {
    saveAlertSettings();
}

function dismissAlert() {
    const banner = document.getElementById("alertBanner");
    if (banner) banner.classList.remove("show");
}

// ---------- Category Selection in Popup ----------
function selectCategory(btn) {
    document.querySelectorAll(".cat-tag").forEach(tag => tag.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.getAttribute("data-cat") || "general";
}

// ---------- Calculate Budget ----------
function calculate() {
    let salary = Number(document.getElementById("salary").value) || 0;
    let grocery = Number(document.getElementById("grocery").value) || 0;
    let vegetables = Number(document.getElementById("vegetables").value) || 0;
    let fruits = Number(document.getElementById("fruits").value) || 0;
    let transport = Number(document.getElementById("transport").value) || 0;
    let mobile = Number(document.getElementById("mobile").value) || 0;

    let customTotal = getCustomExpensesTotal();
    let total = grocery + vegetables + fruits + transport + mobile + customTotal;
    let remaining = salary - total;

    // Update result section
    document.getElementById("total").innerHTML = `${currentCurrency} ${total.toLocaleString()}`;
    document.getElementById("remaining").innerHTML = `${currentCurrency} ${remaining.toLocaleString()}`;

    // Update summary cards
    document.getElementById("salaryCard").innerHTML = `${currentCurrency} ${salary.toLocaleString()}`;
    document.getElementById("expenseCard").innerHTML = `${currentCurrency} ${total.toLocaleString()}`;
    document.getElementById("remainingCard").innerHTML = `${currentCurrency} ${remaining.toLocaleString()}`;

    // Calculate progress percentage
    let percent = 0;
    if (salary > 0) {
        percent = (total / salary) * 100;
        if (percent > 100) percent = 100;
    }

    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const warning = document.getElementById("budgetWarning");

    progressFill.style.width = percent + "%";
    progressPercent.innerHTML = Math.round(percent) + "%";

    // Update progress bar color + warning status
    if (percent <= 60) {
        progressFill.style.background = "linear-gradient(90deg, #4ade80, #22c55e)";
        warning.className = "budget-status status-safe";
        warning.innerHTML = '<i class="fa-solid fa-circle-check"></i> Budget is under control';
    } else if (percent <= 85) {
        progressFill.style.background = "linear-gradient(90deg, #fbbf24, #f59e0b)";
        warning.className = "budget-status status-warning";
        warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Approaching budget limit';
    } else if (percent < 100) {
        progressFill.style.background = "linear-gradient(90deg, #f87171, #ef4444)";
        warning.className = "budget-status status-danger";
        warning.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Very little budget left!';
    } else {
        progressFill.style.background = "linear-gradient(90deg, #ef4444, #991b1b)";
        warning.className = "budget-status status-critical";
        warning.innerHTML = '<i class="fa-solid fa-ban"></i> Budget Exceeded!';
    }

    // Update badge color
    const badge = document.getElementById("progressPercent");
    if (percent <= 60) badge.style.background = "#22c55e";
    else if (percent <= 85) badge.style.background = "#f59e0b";
    else badge.style.background = "#ef4444";

    // Savings Goal
    const goal = Number(document.getElementById("goal").value) || 0;
    const goalStatus = document.getElementById("goalStatus");

    if (goal <= 0) {
        goalStatus.innerHTML = "🎯 Enter your savings goal to get started.";
        goalStatus.style.color = "";
    } else if (remaining >= goal) {
        goalStatus.innerHTML = "🏆 Congratulations! You've achieved your savings goal!";
        goalStatus.style.color = "#4ade80";
    } else {
        const need = goal - remaining;
        goalStatus.innerHTML = `💰 You need <strong>${currentCurrency} ${need.toLocaleString()}</strong> more to reach your goal.`;
        goalStatus.style.color = "#fbbf24";
    }

    // Update custom expenses badge
    document.getElementById("customTotalBadge").innerHTML = `${currentCurrency} ${customTotal.toLocaleString()}`;

    // Check Budget Alert Threshold
    checkBudgetAlert(percent, salary);

    // Update Donut Chart
    drawDonutChart({ grocery, vegetables, fruits, transport, mobile, customExpenses });

    // Generate Smart Insights
    generateSmartInsights({ salary, grocery, vegetables, fruits, transport, mobile, total, remaining, goal, customExpenses });

    // Render Calendar & Subscriptions
    renderCalendar();
}

// ---------- Smart Insights & Financial Advice Generator ----------
function generateSmartInsights(data) {
    const container = document.getElementById("insightsContainer");
    if (!container) return;

    if (data.salary <= 0 && data.total <= 0) {
        container.innerHTML = `
            <div class="insight-item insight-neutral">
                <i class="fa-solid fa-chart-line"></i>
                <span>Enter income and expenses to generate personal spending insights.</span>
            </div>
        `;
        return;
    }

    let insights = [];

    if (data.salary > 0) {
        const savingsRate = Math.round((data.remaining / data.salary) * 100);
        if (savingsRate >= 20) {
            insights.push({
                type: "positive",
                icon: "fa-circle-check",
                text: `Awesome job! You are saving <strong>${savingsRate}%</strong> of your monthly income.`
            });
        } else if (savingsRate < 0) {
            insights.push({
                type: "danger",
                icon: "fa-circle-exclamation",
                text: `Critical Alert: Expenses exceed your income by <strong>${currentCurrency} ${Math.abs(data.remaining).toLocaleString()}</strong>.`
            });
        } else {
            insights.push({
                type: "warning",
                icon: "fa-triangle-exclamation",
                text: `Your savings rate is only <strong>${savingsRate}%</strong>. Financial experts recommend saving at least 20%.`
            });
        }
    }

    if (data.total > 0) {
        const categoriesMap = [
            { label: "Grocery", amount: data.grocery },
            { label: "Vegetables", amount: data.vegetables },
            { label: "Fruits", amount: data.fruits },
            { label: "Transport", amount: data.transport },
            { label: "Mobile", amount: data.mobile }
        ];

        data.customExpenses.forEach(exp => {
            const catLabel = CATEGORIES[exp.category]?.label || "Other";
            const existing = categoriesMap.find(c => c.label === catLabel);
            if (existing) existing.amount += exp.amount;
            else categoriesMap.push({ label: catLabel, amount: exp.amount });
        });

        const highest = categoriesMap.reduce((prev, curr) => (curr.amount > prev.amount) ? curr : prev, { label: "None", amount: 0 });
        if (highest.amount > 0) {
            const highPercent = Math.round((highest.amount / data.total) * 100);
            insights.push({
                type: highPercent > 40 ? "warning" : "neutral",
                icon: "fa-pie-chart",
                text: `<strong>${highest.label}</strong> is your top expense category, making up <strong>${highPercent}%</strong> of total spending (${currentCurrency} ${highest.amount.toLocaleString()}).`
            });
        }
    }

    if (data.goal > 0 && data.remaining > 0) {
        if (data.remaining >= data.goal) {
            insights.push({
                type: "positive",
                icon: "fa-trophy",
                text: `Savings goal achieved! You have <strong>${currentCurrency} ${(data.remaining - data.goal).toLocaleString()}</strong> surplus.`
            });
        } else {
            const diff = data.goal - data.remaining;
            insights.push({
                type: "neutral",
                icon: "fa-bullseye",
                text: `Reduce expenses by <strong>${currentCurrency} ${diff.toLocaleString()}</strong> to hit your Savings Goal.`
            });
        }
    }

    container.innerHTML = insights.map(item => `
        <div class="insight-item insight-${item.type}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.text}</span>
        </div>
    `).join("");
}

// ---------- Budget Alert Check ----------
function checkBudgetAlert(percent, salary) {
    const banner = document.getElementById("alertBanner");
    const bannerText = document.getElementById("alertBannerText");
    if (!budgetAlertSettings.enabled || salary <= 0) {
        if (banner) banner.classList.remove("show");
        return;
    }

    if (percent >= budgetAlertSettings.threshold) {
        if (bannerText) {
            bannerText.innerHTML = `Warning! You have used <strong>${Math.round(percent)}%</strong> of your budget (Threshold: ${budgetAlertSettings.threshold}%)`;
        }
        if (banner) banner.classList.add("show");
    } else {
        if (banner) banner.classList.remove("show");
    }
}

// ---------- Donut Chart Renderer (Canvas API) ----------
function drawDonutChart(data) {
    const canvas = document.getElementById("donutChart");
    const legend = document.getElementById("chartLegend");
    const centerAmount = document.getElementById("chartCenterAmount");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 105;
    const innerRadius = 72;

    ctx.clearRect(0, 0, width, height);

    const categoriesMap = [
        { label: "Grocery", amount: data.grocery, color: "#38bdf8" },
        { label: "Vegetables", amount: data.vegetables, color: "#22c55e" },
        { label: "Fruits", amount: data.fruits, color: "#f59e0b" },
        { label: "Transport", amount: data.transport, color: "#a855f7" },
        { label: "Mobile", amount: data.mobile, color: "#ec4899" }
    ];

    data.customExpenses.forEach(exp => {
        const catObj = CATEGORIES[exp.category] || CATEGORIES.general;
        const existing = categoriesMap.find(c => c.label === catObj.label);
        if (existing) {
            existing.amount += exp.amount;
        } else {
            categoriesMap.push({ label: catObj.label, amount: exp.amount, color: catObj.color });
        }
    });

    const activeItems = categoriesMap.filter(c => c.amount > 0);
    const totalAmount = activeItems.reduce((sum, c) => sum + c.amount, 0);

    if (centerAmount) {
        centerAmount.innerText = `${currentCurrency} ${totalAmount.toLocaleString()}`;
    }

    if (totalAmount === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fill();

        if (legend) {
            legend.innerHTML = '<p class="comparison-empty" style="grid-column: span 2;">No expenses added yet.</p>';
        }
        return;
    }

    let startAngle = -Math.PI / 2;
    let legendHtml = "";

    activeItems.forEach(item => {
        const sliceAngle = (item.amount / totalAmount) * (2 * Math.PI);
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();

        ctx.fillStyle = item.color;
        ctx.fill();

        startAngle = endAngle;

        const percentage = Math.round((item.amount / totalAmount) * 100);
        legendHtml += `
            <div class="legend-item">
                <span class="legend-color" style="background: ${item.color};"></span>
                <span class="legend-label">${item.label}</span>
                <span class="legend-val">${percentage}%</span>
            </div>
        `;
    });

    if (legend) {
        legend.innerHTML = legendHtml;
    }
}

// ---------- Subscriptions & Recurring Bills Manager ----------
function renderSubscriptions() {
    const list = document.getElementById("subscriptionsList");
    if (!list) return;

    if (subscriptions.length === 0) {
        list.innerHTML = '<p class="comparison-empty">No recurring bills added yet.</p>';
        return;
    }

    list.innerHTML = subscriptions.map((sub, index) => `
        <div class="sub-card">
            <div class="sub-info">
                <div class="sub-icon"><i class="fa-solid fa-receipt"></i></div>
                <div class="sub-details">
                    <h4>${sub.name}</h4>
                    <p>Due ${sub.dueDate}th of every month</p>
                </div>
            </div>
            <div class="sub-right">
                <span class="sub-amount">${currentCurrency} ${sub.amount.toLocaleString()}</span>
                <button class="sub-status-btn ${sub.status}" onclick="toggleSubStatus(${index})">
                    ${sub.status.toUpperCase()}
                </button>
                <button class="sub-delete-btn" onclick="deleteSubscription(${index})" title="Delete">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    `).join("");
}

function toggleSubStatus(index) {
    subscriptions[index].status = subscriptions[index].status === "paid" ? "unpaid" : "paid";
    saveSubscriptions();
    renderSubscriptions();
    showToast(`Bill marked as ${subscriptions[index].status}!`);
}

function openSubModal() {
    document.getElementById("subModal").classList.add("show");
}

function closeSubModal() {
    document.getElementById("subModal").classList.remove("show");
}

function closeSubModalOutside(event) {
    if (event.target === document.getElementById("subModal")) {
        closeSubModal();
    }
}

function addSubscription() {
    const name = document.getElementById("subName").value.trim();
    const amount = Number(document.getElementById("subAmount").value);
    const dueDate = Number(document.getElementById("subDueDate").value) || 1;

    if (name === "" || !amount || amount <= 0) {
        showToast("Please enter a valid bill name & amount!", "error");
        return;
    }

    subscriptions.push({ name, amount, dueDate, status: "unpaid" });
    saveSubscriptions();
    renderSubscriptions();
    showToast(`${name} added to recurring bills!`);

    document.getElementById("subName").value = "";
    document.getElementById("subAmount").value = "";
    document.getElementById("subDueDate").value = "";
    closeSubModal();
}

function deleteSubscription(index) {
    subscriptions.splice(index, 1);
    saveSubscriptions();
    renderSubscriptions();
    showToast("Subscription deleted");
}

// ---------- Daily Spending Calendar Renderer ----------
function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const monthTitle = document.getElementById("calendarMonthTitle");
    if (!grid) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthTitle.innerText = calendarDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let calendarHtml = "";

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += `<div class="cal-day empty"></div>`;
    }

    const todayStr = new Date();

    for (let day = 1; day <= totalDays; day++) {
        const isToday = (day === todayStr.getDate() && month === todayStr.getMonth() && year === todayStr.getFullYear());
        let dayTotal = 0;
        if (customExpenses.length > 0 && day % 3 === 0) {
            dayTotal = customExpenses[0].amount;
        }

        calendarHtml += `
            <div class="cal-day ${isToday ? 'today' : ''} ${dayTotal > 0 ? 'has-expense' : ''}">
                <span>${day}</span>
                ${dayTotal > 0 ? `<span class="cal-day-amount">${dayTotal}</span>` : ''}
            </div>
        `;
    }

    grid.innerHTML = calendarHtml;
}

function prevMonth() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
}

// ---------- Auto-calculate on input ----------
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculate);
});

// ---------- Load saved inputs ----------
document.querySelectorAll("input").forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) {
        input.value = savedValue;
    }
});

// ---------- Render Custom Expenses ----------
function renderCustomExpenses() {
    const list = document.getElementById("customExpensesList");
    const section = document.getElementById("customExpensesSection");

    if (customExpenses.length === 0) {
        section.style.display = "none";
        list.innerHTML = "";
        return;
    }

    section.style.display = "block";
    list.innerHTML = customExpenses.map((exp, index) => {
        const cat = CATEGORIES[exp.category] || CATEGORIES.general;
        return `
            <div class="custom-expense-item" id="customExp${index}">
                <div class="custom-expense-info">
                    <span class="custom-expense-badge" style="background: ${cat.color};">
                        <i class="fa-solid ${cat.icon}"></i> ${cat.label}
                    </span>
                    <span class="custom-expense-name">${exp.name}</span>
                </div>
                <div class="custom-expense-right">
                    <span class="custom-expense-amount">${currentCurrency} ${exp.amount.toLocaleString()}</span>
                    <button class="custom-expense-delete" onclick="deleteCustomExpense(${index})" title="Delete">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// ---------- Auto Save ----------
function saveData() {
    document.querySelectorAll("input").forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", saveData);
});

// ---------- Save Budget History & Monthly Comparison ----------
function saveBudget() {
    const salary = document.getElementById("salary").value || 0;
    const grocery = document.getElementById("grocery").value || 0;
    const vegetables = document.getElementById("vegetables").value || 0;
    const fruits = document.getElementById("fruits").value || 0;
    const transport = document.getElementById("transport").value || 0;
    const mobile = document.getElementById("mobile").value || 0;
    const expense = document.getElementById("expenseCard").innerText;
    const remaining = document.getElementById("remainingCard").innerText;
    const date = new Date().toLocaleDateString();

    const row = `
<tr>
<td>${date}</td>
<td>${salary}</td>
<td>${grocery}</td>
<td>${vegetables}</td>
<td>${fruits}</td>
<td>${transport}</td>
<td>${mobile}</td>
<td>${expense}</td>
<td>${remaining}</td>
<td>
<button onclick="editRow(this)"><i class="fa-solid fa-pen"></i></button>
<button onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i></button>
</td>
</tr>
`;

    document.getElementById("historyBody").innerHTML += row;
    localStorage.setItem("budgetHistory", document.getElementById("historyBody").innerHTML);

    saveMonthlyEntry(salary, expense);
    renderMonthlyComparison();
    showToast("Budget saved successfully!");
}

// ---------- Monthly Comparison Storage & Renderer ----------
function saveMonthlyEntry(salary, expenseText) {
    let monthlyHistory = JSON.parse(localStorage.getItem("monthlyHistory")) || [];
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const cleanExpense = Number(expenseText.replace(/[^0-9]/g, "")) || 0;

    const existingIndex = monthlyHistory.findIndex(m => m.month === monthYear);
    if (existingIndex >= 0) {
        monthlyHistory[existingIndex].expense = cleanExpense;
        monthlyHistory[existingIndex].salary = Number(salary);
    } else {
        monthlyHistory.push({ month: monthYear, salary: Number(salary), expense: cleanExpense });
    }

    localStorage.setItem("monthlyHistory", JSON.stringify(monthlyHistory));
}

function renderMonthlyComparison() {
    const container = document.getElementById("comparisonChart");
    if (!container) return;

    let monthlyHistory = JSON.parse(localStorage.getItem("monthlyHistory")) || [];

    if (monthlyHistory.length === 0) {
        container.innerHTML = '<p class="comparison-empty" id="comparisonEmpty">Save budgets to see monthly comparison.</p>';
        return;
    }

    const maxExpense = Math.max(...monthlyHistory.map(m => m.expense), 1);

    container.innerHTML = monthlyHistory.map(m => {
        const percent = Math.min(Math.round((m.expense / maxExpense) * 100), 100);
        return `
            <div class="comp-bar-wrapper">
                <div class="comp-bar-header">
                    <span>${m.month}</span>
                    <span>${currentCurrency} ${m.expense.toLocaleString()}</span>
                </div>
                <div class="comp-bar-track">
                    <div class="comp-bar-fill" style="width: ${percent}%; background: linear-gradient(90deg, #6366f1, #38bdf8);">
                        ${percent > 20 ? percent + '%' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function clearMonthlyData() {
    if (!confirm("Clear monthly comparison history?")) return;
    localStorage.removeItem("monthlyHistory");
    renderMonthlyComparison();
    showToast("Monthly comparison cleared");
}

// ---------- Delete Row ----------
function deleteRow(btn) {
    const row = btn.parentElement.parentElement;
    row.style.opacity = "0";
    row.style.transform = "translateX(20px)";
    row.style.transition = "0.3s";
    setTimeout(() => {
        row.remove();
        localStorage.setItem("budgetHistory", document.getElementById("historyBody").innerHTML);
    }, 280);
}

// ---------- Load Budget History ----------
const historyData = localStorage.getItem("budgetHistory");
if (historyData) {
    document.getElementById("historyBody").innerHTML = historyData;
}

// ---------- Edit Row ----------
function editRow(btn) {
    const row = btn.parentElement.parentElement;
    document.getElementById("salary").value = row.cells[1].innerText;
    document.getElementById("grocery").value = row.cells[2].innerText;
    document.getElementById("vegetables").value = row.cells[3].innerText;
    document.getElementById("fruits").value = row.cells[4].innerText;
    document.getElementById("transport").value = row.cells[5].innerText;
    document.getElementById("mobile").value = row.cells[6].innerText;
    calculate();
    saveData();
    document.getElementById("formSection").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Row loaded for editing");
}

// ---------- Date Display ----------
const today = new Date();
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("todayDate").innerHTML = today.toLocaleDateString('en-US', dateOptions);

// ---------- FAB & Popup ----------
function fabClick() {
    document.getElementById("popup").classList.add("show");
    setTimeout(() => {
        document.getElementById("expenseName").focus();
    }, 400);
}

function closePopup() {
    document.getElementById("popup").classList.remove("show");
}

function closePopupOutside(event) {
    if (event.target === document.getElementById("popup")) {
        closePopup();
    }
}

// ---------- Add Custom Expense ----------
function addExpense() {
    const nameInput = document.getElementById("expenseName");
    const amountInput = document.getElementById("expenseAmount");
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);

    if (name === "" || !amount || amount <= 0) {
        showToast("Please enter a valid name and amount!", "error");
        return;
    }

    customExpenses.push({ name: name, amount: amount, category: selectedCategory });
    saveCustomExpenses();

    renderCustomExpenses();
    calculate();

    showToast(`${name} — ${currentCurrency} ${amount.toLocaleString()} added!`);

    nameInput.value = "";
    amountInput.value = "";
    closePopup();
}

// ---------- Delete Custom Expense ----------
function deleteCustomExpense(index) {
    const item = document.getElementById("customExp" + index);
    if (item) {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        item.style.transition = "0.3s";
    }
    setTimeout(() => {
        customExpenses.splice(index, 1);
        saveCustomExpenses();
        renderCustomExpenses();
        calculate();
        showToast("Expense removed");
    }, 280);
}

// ---------- Clear All Custom Expenses ----------
function clearAllCustomExpenses() {
    if (customExpenses.length === 0) return;
    if (!confirm("Clear all custom expenses?")) return;

    customExpenses = [];
    saveCustomExpenses();
    renderCustomExpenses();
    calculate();
    showToast("All custom expenses cleared");
}

// ---------- Search History ----------
function searchHistory() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#historyBody tr");
    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

// ---------- Export to CSV ----------
function exportCSV() {
    const rows = document.querySelectorAll("#historyTable tr");
    if (rows.length <= 1) {
        showToast("No history data to export!", "error");
        return;
    }

    let csvContent = "";
    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        let rowData = [];
        cols.forEach((col, index) => {
            if (index < cols.length - 1) {
                rowData.push('"' + col.innerText.replace(/"/g, '""') + '"');
            }
        });
        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `budget_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV exported successfully!");
}

// ---------- Export to PDF / Print ----------
function exportPDF() {
    const rows = document.querySelectorAll("#historyBody tr");
    if (rows.length === 0) {
        showToast("No history data to export!", "error");
        return;
    }

    const printWindow = window.open('', '', 'height=700,width=900');
    const tableHtml = document.getElementById("historyTable").outerHTML;

    printWindow.document.write(`
        <html>
        <head>
            <title>Budget History Export</title>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h2 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
                th { background-color: #4f46e5; color: white; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                td:last-child, th:last-child { display: none; }
            </style>
        </head>
        <body>
            <h2>💰 Monthly Budget Tracker — History Export</h2>
            <p>Export Date: ${new Date().toLocaleString()}</p>
            ${tableHtml}
            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ---------- Reset Budget ----------
function resetBudget() {
    if (!confirm("Reset current budget? This will clear all input fields.")) return;

    document.querySelectorAll("input").forEach(input => {
        if (input.id !== "searchInput" && input.id !== "goal" && input.id !== "alertThreshold" && input.id !== "alertToggle") {
            input.value = "";
            localStorage.removeItem(input.id);
        }
    });

    calculate();
    showToast("Budget reset successfully");
}

// ---------- Theme Toggle ----------
function toggleTheme() {
    document.body.classList.toggle("light-theme");
    const icon = document.querySelector("#themeToggle i");
    if (document.body.classList.contains("light-theme")) {
        if (icon) icon.className = "fa-solid fa-sun";
        localStorage.setItem("theme", "light");
    } else {
        if (icon) icon.className = "fa-solid fa-moon";
        localStorage.setItem("theme", "dark");
    }
}

// Load saved theme on startup
(function loadTheme() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
        const icon = document.querySelector("#themeToggle i");
        if (icon) icon.className = "fa-solid fa-sun";
    }
})();

// ---------- Toast Notification ----------
function showToast(message, type = "success") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        color: #fff;
        z-index: 9999;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
    `;

    if (type === "error") {
        toast.style.background = "rgba(239, 68, 68, 0.9)";
        toast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + message;
    } else {
        toast.style.background = "rgba(34, 197, 94, 0.9)";
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + message;
    }

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ---------- Initial Setup ----------
loadAlertSettings();
renderCustomExpenses();
renderSubscriptions();
renderMonthlyComparison();
initPinLock();
calculate();
changeCurrency(currentCurrency);

// ---------- Intersection Observer ----------
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".glass-card, .summary-card").forEach(card => {
    observer.observe(card);
});
