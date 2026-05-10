// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const getStartedBtn = document.getElementById('getStartedBtn');
const closeModalBtn = document.querySelector('.close');
const loginNavBtn = document.getElementById('loginNavBtn');
const logoutBtn = document.getElementById('logoutBtn');
const navLinks = document.querySelectorAll('.nav-link');
const pageLinks = document.querySelectorAll('[data-section]');
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');
const menuLinks = document.querySelectorAll('.menu-link');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');

// Data Storage
let currentUser = null;
let userData = {
    tasks: [],
    health: [],
    mentalHealth: [],
    habits: [],
    expenses: [],
    notes: [],
    chat: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    setupEventListeners();
    loadData();
});

// Check if user is logged in
function checkLogin() {
    const storedUser = localStorage.getItem('lifecareUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        showHomePage();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Modal
    getStartedBtn.addEventListener('click', openLoginModal);
    loginNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
    closeModalBtn.addEventListener('click', closeLoginModal);
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });

    // Login Form
    loginForm.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('login-btn')) return;
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Hamburger Menu
    hamburger.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
    });

    // Close hamburger menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('active');
        });
    });

    // Sidebar Menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            switchDashboardTab(tab);
            
            // Update active menu link
            menuLinks.forEach(m => m.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Dashboard Functions
    document.getElementById('addTaskForm').addEventListener('submit', addTask);
    document.getElementById('addHealthForm').addEventListener('submit', addHealthMetric);
    document.getElementById('mentalHealthForm').addEventListener('submit', addMentalHealthEntry);
    document.getElementById('addHabitForm').addEventListener('submit', addHabit);
    document.getElementById('addExpenseForm').addEventListener('submit', addExpense);
    document.getElementById('addNoteForm').addEventListener('submit', addNote);
    document.getElementById('supportChatForm').addEventListener('submit', addChatMessage);
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);

    // Breathing Exercise
    document.getElementById('breathingBtn').addEventListener('click', startBreathingExercise);

    // Recommendations Button
    document.getElementById('getRecommendationBtn').addEventListener('click', getRecommendations);

    // Stress Level Slider
    document.getElementById('stressInput').addEventListener('change', function() {
        document.getElementById('stressValue').textContent = this.value;
    });
}

// Open Login Modal
function openLoginModal() {
    loginModal.style.display = 'block';
}

// Close Login Modal
function closeLoginModal() {
    loginModal.style.display = 'none';
    loginForm.reset();
    document.getElementById('loginError').style.display = 'none';
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    if (email && password && role) {
        currentUser = {
            email: email,
            role: role,
            nickname: email.split('@')[0]
        };

        localStorage.setItem('lifecareUser', JSON.stringify(currentUser));
        localStorage.setItem('lifecareData', JSON.stringify(userData));
        
        closeLoginModal();
        showDashboard();
    } else {
        showLoginError();
    }
}

// Show Login Error
function showLoginError() {
    const errorMsg = document.getElementById('loginError');
    errorMsg.style.display = 'block';
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 3000);
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('lifecareUser');
    localStorage.removeItem('lifecareData');
    currentUser = null;
    userData = {
        tasks: [],
        health: [],
        mentalHealth: [],
        habits: [],
        expenses: [],
        notes: [],
        chat: []
    };
    showHomePage();
}

// Show Dashboard
function showDashboard() {
    // Hide home page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('dashboard').classList.add('active');
    
    // Update user greeting
    document.getElementById('userGreeting').textContent = 'Hi, ' + currentUser.nickname;
    
    // Show user nav items
    document.getElementById('loginNavItem').style.display = 'none';
    document.getElementById('userNavItem').style.display = 'block';
    
    // Load and display data
    loadData();
    updateDashboardOverview();
    switchDashboardTab('dashboard-overview');
    menuLinks[0].classList.add('active');
}

// Show Home Page
function showHomePage() {
    // Show home page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('home').classList.add('active');
    document.getElementById('dashboard').style.display = 'none';
    
    // Show login nav items
    document.getElementById('loginNavItem').style.display = 'block';
    document.getElementById('userNavItem').style.display = 'none';
    
    // Reset navigation
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[0].classList.add('active');
}

// Navigate to Section
function navigateToSection(section) {
    document.querySelectorAll('.page-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Switch Dashboard Tab
function switchDashboardTab(tabName) {
    dashboardTabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Save Data
function saveData() {
    if (currentUser) {
        localStorage.setItem('lifecareData', JSON.stringify(userData));
    }
}

// Load Data
function loadData() {
    const storedData = localStorage.getItem('lifecareData');
    if (storedData) {
        userData = JSON.parse(storedData);
    }
    displayAllData();
}

// Display All Data
function displayAllData() {
    displayTasks();
    displayHealthHistory();
    displayMentalHealthHistory();
    displayHabits();
    displayExpenses();
    displayNotes();
    displayChatMessages();
    loadProfile();
}

// ============ SMART ACADEMIC PLANNER ============

// Add Task
function addTask(e) {
    e.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskPriority = document.getElementById('taskPriority').value;

    const task = {
        id: Date.now(),
        name: taskName,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false
    };

    userData.tasks.push(task);
    saveData();
    displayTasks();
    updateDashboardOverview();
    document.getElementById('addTaskForm').reset();
}

// Display Tasks
function displayTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    if (userData.tasks.length === 0) {
        tasksList.innerHTML = '<p>No tasks yet. Add one to get started.</p>';
        return;
    }

    userData.tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskDiv.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-details">
                <div class="task-name">${task.name}</div>
                <div class="task-due-date">Due: ${task.dueDate}</div>
            </div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <button class="task-delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        tasksList.appendChild(taskDiv);
    });
}

// Toggle Task
function toggleTask(taskId) {
    const task = userData.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        displayTasks();
        updateDashboardOverview();
    }
}

// Delete Task
function deleteTask(taskId) {
    userData.tasks = userData.tasks.filter(t => t.id !== taskId);
    saveData();
    displayTasks();
    updateDashboardOverview();
}

// ============ HEALTH AND WELLNESS MONITORING ============

// Add Health Metric
function addHealthMetric(e) {
    e.preventDefault();
    
    const metric = document.getElementById('healthMetric').value;
    const value = document.getElementById('healthValue').value;
    const date = document.getElementById('healthDate').value;

    const healthEntry = {
        id: Date.now(),
        metric: metric,
        value: value,
        date: date
    };

    userData.health.push(healthEntry);
    saveData();
    displayHealthHistory();
    updateDashboardOverview();
    document.getElementById('addHealthForm').reset();
}

// Display Health History
function displayHealthHistory() {
    const healthList = document.getElementById('healthList');
    healthList.innerHTML = '';

    if (userData.health.length === 0) {
        healthList.innerHTML = '<p>No health data logged yet.</p>';
        return;
    }

    userData.health.slice().reverse().forEach(entry => {
        const healthDiv = document.createElement('div');
        healthDiv.className = 'health-item';
        
        healthDiv.innerHTML = `
            <div class="health-metric">${entry.metric}</div>
            <div class="health-value">${entry.value}</div>
            <div class="health-date">Date: ${entry.date}</div>
            <button class="health-delete-btn" onclick="deleteHealth(${entry.id})">Delete</button>
        `;
        
        healthList.appendChild(healthDiv);
    });
}

// Delete Health Entry
function deleteHealth(healthId) {
    userData.health = userData.health.filter(h => h.id !== healthId);
    saveData();
    displayHealthHistory();
    updateDashboardOverview();
}

// ============ MENTAL HEALTH AND STRESS SUPPORT ============

// Add Mental Health Entry
function addMentalHealthEntry(e) {
    e.preventDefault();
    
    const mood = document.getElementById('moodTracker').value;
    const stress = document.getElementById('stressInput').value;
    const journal = document.getElementById('journalEntry').value;

    const mentalEntry = {
        id: Date.now(),
        mood: mood,
        stress: stress,
        journal: journal,
        date: new Date().toLocaleDateString()
    };

    userData.mentalHealth.push(mentalEntry);
    saveData();
    displayMentalHealthHistory();
    updateDashboardOverview();
    document.getElementById('mentalHealthForm').reset();
    document.getElementById('stressValue').textContent = '5';
    document.getElementById('stressInput').value = '5';
}

// Display Mental Health History
function displayMentalHealthHistory() {
    const mentalList = document.getElementById('mentalHealthList');
    mentalList.innerHTML = '';

    if (userData.mentalHealth.length === 0) {
        mentalList.innerHTML = '<p>No entries yet.</p>';
        return;
    }

    userData.mentalHealth.slice().reverse().forEach(entry => {
        const mentalDiv = document.createElement('div');
        mentalDiv.className = 'mental-item';
        
        mentalDiv.innerHTML = `
            <div class="mental-mood">Mood: ${entry.mood}</div>
            <div class="mental-stress">Stress Level: ${entry.stress}/10</div>
            ${entry.journal ? `<div class="mental-journal">"${entry.journal}"</div>` : ''}
            <div class="mental-date">Date: ${entry.date}</div>
            <button class="mental-delete-btn" onclick="deleteMentalHealth(${entry.id})">Delete</button>
        `;
        
        mentalList.appendChild(mentalDiv);
    });
}

// Delete Mental Health Entry
function deleteMentalHealth(mentalId) {
    userData.mentalHealth = userData.mentalHealth.filter(m => m.id !== mentalId);
    saveData();
    displayMentalHealthHistory();
    updateDashboardOverview();
}

// Start Breathing Exercise
function startBreathingExercise() {
    const animation = document.getElementById('breathingAnimation');
    const text = document.getElementById('breathingText');
    const btn = document.getElementById('breathingBtn');
    
    animation.style.display = 'block';
    btn.disabled = true;
    
    const steps = ['Breathe In...', 'Hold...', 'Breathe Out...', 'Hold...'];
    let step = 0;
    let time = 0;

    const interval = setInterval(() => {
        text.textContent = steps[step];
        step = (step + 1) % steps.length;
        time++;

        if (time >= 8) {
            clearInterval(interval);
            animation.style.display = 'none';
            text.textContent = '';
            btn.disabled = false;
        }
    }, 2000);
}

// ============ DAILY LIFE MANAGEMENT ============

// Add Habit
function addHabit(e) {
    e.preventDefault();
    
    const habitName = document.getElementById('habitName').value;

    const habit = {
        id: Date.now(),
        name: habitName,
        completed: false
    };

    userData.habits.push(habit);
    saveData();
    displayHabits();
    updateDashboardOverview();
    document.getElementById('addHabitForm').reset();
}

// Display Habits
function displayHabits() {
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';

    if (userData.habits.length === 0) {
        habitsList.innerHTML = '<p>No habits yet.</p>';
        return;
    }

    userData.habits.forEach(habit => {
        const habitDiv = document.createElement('div');
        habitDiv.className = 'habit-item';
        
        habitDiv.innerHTML = `
            <input type="checkbox" ${habit.completed ? 'checked' : ''} 
                   onchange="toggleHabit(${habit.id})">
            <div class="habit-name">${habit.name}</div>
            <button class="habit-delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
        `;
        
        habitsList.appendChild(habitDiv);
    });
}

// Toggle Habit
function toggleHabit(habitId) {
    const habit = userData.habits.find(h => h.id === habitId);
    if (habit) {
        habit.completed = !habit.completed;
        saveData();
        displayHabits();
        updateDashboardOverview();
    }
}

// Delete Habit
function deleteHabit(habitId) {
    userData.habits = userData.habits.filter(h => h.id !== habitId);
    saveData();
    displayHabits();
    updateDashboardOverview();
}

// Add Expense
function addExpense(e) {
    e.preventDefault();
    
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;

    const expense = {
        id: Date.now(),
        description: description,
        amount: amount,
        date: date
    };

    userData.expenses.push(expense);
    saveData();
    displayExpenses();
    updateDashboardOverview();
    document.getElementById('addExpenseForm').reset();
}

// Display Expenses
function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    if (userData.expenses.length === 0) {
        expensesList.innerHTML = '<p>No expenses logged yet.</p>';
        return;
    }

    userData.expenses.slice().reverse().forEach(expense => {
        const expenseDiv = document.createElement('div');
        expenseDiv.className = 'expense-item';
        
        expenseDiv.innerHTML = `
            <div class="expense-description">${expense.description}</div>
            <div class="expense-amount">PHP ${expense.amount.toFixed(2)}</div>
            <div class="expense-date">Date: ${expense.date}</div>
            <button class="expense-delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        
        expensesList.appendChild(expenseDiv);
    });
}

// Delete Expense
function deleteExpense(expenseId) {
    userData.expenses = userData.expenses.filter(e => e.id !== expenseId);
    saveData();
    displayExpenses();
    updateDashboardOverview();
}

// Add Note
function addNote(e) {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    const note = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    };

    userData.notes.push(note);
    saveData();
    displayNotes();
    document.getElementById('addNoteForm').reset();
}

// Display Notes
function displayNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    if (userData.notes.length === 0) {
        notesList.innerHTML = '<p>No notes yet.</p>';
        return;
    }

    userData.notes.slice().reverse().forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        
        noteDiv.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
            <div class="note-date">Date: ${note.date}</div>
            <button class="note-delete-btn" onclick="deleteNote(${note.id})">Delete</button>
        `;
        
        notesList.appendChild(noteDiv);
    });
}

// Delete Note
function deleteNote(noteId) {
    userData.notes = userData.notes.filter(n => n.id !== noteId);
    saveData();
    displayNotes();
}

// ============ STUDENT SUPPORT SYSTEM ============

// Add Chat Message
function addChatMessage(e) {
    e.preventDefault();
    
    const message = document.getElementById('supportMessage').value;

    const chatEntry = {
        id: Date.now(),
        author: currentUser.nickname,
        message: message,
        time: new Date().toLocaleTimeString()
    };

    userData.chat.push(chatEntry);
    saveData();
    displayChatMessages();
    document.getElementById('supportChatForm').reset();
}

// Display Chat Messages
function displayChatMessages() {
    const chatList = document.getElementById('supportChatList');
    chatList.innerHTML = '';

    if (userData.chat.length === 0) {
        chatList.innerHTML = '<p>No messages yet. Start a conversation.</p>';
        return;
    }

    userData.chat.slice().reverse().forEach(chat => {
        const chatDiv = document.createElement('div');
        chatDiv.className = 'chat-message';
        
        chatDiv.innerHTML = `
            <div class="chat-author">${chat.author}</div>
            <div class="chat-text">${chat.message}</div>
            <div class="chat-time">${chat.time}</div>
        `;
        
        chatList.appendChild(chatDiv);
    });
}

// Get Recommendations
function getRecommendations() {
    const recommendations = [
        {
            title: "Take a Break",
            text: "You've been working hard. Take a 15-minute break and stretch."
        },
        {
            title: "Hydrate",
            text: "Drink some water. Staying hydrated improves focus and mood."
        },
        {
            title: "Go for a Walk",
            text: "A short walk outside can help reduce stress and clear your mind."
        },
        {
            title: "Practice Meditation",
            text: "Even 5 minutes of meditation can help calm your mind."
        },
        {
            title: "Call a Friend",
            text: "Social connection is important for mental health. Reach out to someone you care about."
        },
        {
            title: "Get Some Sleep",
            text: "If you're feeling tired, prioritize getting enough sleep tonight."
        }
    ];

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    // Get 2-3 random recommendations
    const shuffled = recommendations.sort(() => 0.5 - Math.random()).slice(0, 3);

    shuffled.forEach(rec => {
        const recDiv = document.createElement('div');
        recDiv.className = 'recommendation-item';
        
        recDiv.innerHTML = `
            <div class="recommendation-title">${rec.title}</div>
            <div class="recommendation-text">${rec.text}</div>
        `;
        
        recommendationsList.appendChild(recDiv);
    });
}

// ============ PROFILE MANAGEMENT ============

// Load Profile
function loadProfile() {
    if (currentUser) {
        document.getElementById('profileNickname').value = currentUser.nickname;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profileRole').value = currentUser.role;
    }
}

// Save Profile
function saveProfile(e) {
    e.preventDefault();
    
    currentUser.nickname = document.getElementById('profileNickname').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.role = document.getElementById('profileRole').value;

    localStorage.setItem('lifecareUser', JSON.stringify(currentUser));
    document.getElementById('userGreeting').textContent = 'Hi, ' + currentUser.nickname;
    
    alert('Profile updated successfully!');
}

// ============ DASHBOARD OVERVIEW ============

// Update Dashboard Overview
function updateDashboardOverview() {
    // Academic Planner
    const totalTasks = userData.tasks.length;
    const completedTasks = userData.tasks.filter(t => t.completed).length;
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;

    // Health
    const waterEntry = userData.health.find(h => h.metric === 'Water Intake');
    const sleepEntry = userData.health.find(h => h.metric === 'Sleep');
    document.getElementById('waterIntake').textContent = waterEntry ? waterEntry.value : 0;
    document.getElementById('sleepHours').textContent = sleepEntry ? sleepEntry.value : 0;

    // Task Management
    const pendingTasks = userData.tasks.filter(t => !t.completed).length;
    const completedPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completedPercent').textContent = completedPercent;

    // Budget
    const totalExpenses = userData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const budgetRemaining = 5000 - totalExpenses;
    document.getElementById('budgetRemaining').textContent = budgetRemaining.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);

    // Mental Health
    const lastMental = userData.mentalHealth[userData.mentalHealth.length - 1];
    const lastStress = lastMental ? lastMental.stress : 0;
    const lastMood = lastMental ? lastMental.mood : 'Not Set';
    document.getElementById('currentMood').textContent = lastMood;
    document.getElementById('stressLevel').textContent = lastStress;

    // Habits
    const habitsCompleted = userData.habits.filter(h => h.completed).length;
    document.getElementById('habitsCount').textContent = userData.habits.length;
    document.getElementById('habitsCompleted').textContent = habitsCompleted;
}

// ============ CONTACT FORM ============

// Handle Contact Form
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    alert(`Thank you for your message, ${name}!\n\nWe will get back to you soon at ${email}.`);
    document.getElementById('contactForm').reset();
}
