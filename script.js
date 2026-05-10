// ========== NAVIGATION ========== 
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const page = link.dataset.page;
        navigateToPage(page);
    });
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close hamburger menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== PAGE NAVIGATION ========== 
function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    switch(page) {
        case 'home':
            document.getElementById('homePage').classList.add('active');
            break;
        case 'features':
            document.getElementById('featuresPage').classList.add('active');
            break;
        case 'about':
            document.getElementById('aboutPage').classList.add('active');
            break;
        case 'contact':
            document.getElementById('contactPage').classList.add('active');
            break;
    }
}

// ========== LOGIN ========== 
function showLoginForm() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginForm() {
    document.getElementById('loginModal').classList.remove('show');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('errorMessage');

    // Simple validation
    if (email && password && role) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', email.split('@')[0]);
        localStorage.setItem('isLoggedIn', 'true');

        // Show dashboard
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('dashboardPage').classList.add('active');
        document.getElementById('logoutNav').style.display = 'block';

        // Initialize dashboard
        initializeDashboard();
        closeLoginForm();
    } else {
        errorMessage.textContent = 'Invalid login credentials!';
        errorMessage.classList.add('show');
    }
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('homePage').classList.add('active');
    document.getElementById('logoutNav').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// ========== DASHBOARD INITIALIZATION ========== 
function initializeDashboard() {
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'Student';

    document.getElementById('userGreeting').textContent = `Hi, ${userName}`;
    document.getElementById('userRole').textContent = userRole;
    document.getElementById('profileName').value = userName;
    document.getElementById('profileNickname').value = userName;
    document.getElementById('profileEmail').value = localStorage.getItem('userEmail');
    document.getElementById('profileRole').value = userRole;

    loadDashboardData();
}

// Sidebar navigation
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const section = link.dataset.section;
        showDashboardSection(section);
    });
});

function showDashboardSection(section) {
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + 'Section').classList.add('active');
}

// ========== SMART ACADEMIC PLANNER ========== 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const className = document.getElementById('className').value;
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (taskName && className && dueDate) {
        const task = {
            id: Date.now(),
            className,
            taskName,
            dueDate,
            priority,
            completed: false
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('className').value = '';
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        
        renderTasks();
        updateDashboardStats();
    }
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'item';
        taskEl.innerHTML = `
            <div>
                <strong>${task.className}</strong> - ${task.taskName}<br>
                Due: ${task.dueDate} | Priority: ${task.priority}
            </div>
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        tasksList.appendChild(taskEl);
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateDashboardStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateDashboardStats();
}

// ========== HEALTH & WELLNESS ========== 
let healthData = JSON.parse(localStorage.getItem('healthData')) || {
    waterIntake: [],
    sleepHours: [],
    activities: [],
    meals: [],
    medications: []
};

function addWaterIntake() {
    const amount = parseFloat(document.getElementById('waterAmount').value);
    if (amount > 0) {
        healthData.waterIntake.push({
            date: new Date().toLocaleDateString(),
            amount: amount
        });
        localStorage.setItem('healthData', JSON.stringify(healthData));
        document.getElementById('waterAmount').value = '';
        updateHealthDisplay();
        updateDashboardStats();
    }
}

function addSleepLog() {
    const hours = parseFloat(document.getElementById('sleepAmount').value);
    if (hours > 0) {
        healthData.sleepHours.push({
            date: new Date().toLocaleDateString(),
            hours: hours
        });
        localStorage.setItem('healthData', JSON.stringify(healthData));
        document.getElementById('sleepAmount').value = '';
        updateHealthDisplay();
        updateDashboardStats();
    }
}

function addActivity() {
    const activity = document.getElementById('activity').value;
    const duration = parseFloat(document.getElementById('activityDuration').value);
    if (activity && duration > 0) {
        healthData.activities.push({
            date: new Date().toLocaleDateString(),
            activity: activity,
            duration: duration
        });
        localStorage.setItem('healthData', JSON.stringify(healthData));
        document.getElementById('activity').value = '';
        document.getElementById('activityDuration').value = '';
        updateDashboardStats();
    }
}

function addMeal() {
    const meal = document.getElementById('meal').value;
    const nutrition = document.getElementById('nutrition').value;
    if (meal) {
        healthData.meals.push({
            date: new Date().toLocaleDateString(),
            meal: meal,
            nutrition: nutrition
        });
        localStorage.setItem('healthData', JSON.stringify(healthData));
        document.getElementById('meal').value = '';
        document.getElementById('nutrition').value = '';
    }
}

function addMedication() {
    const med = document.getElementById('medication').value;
    const time = document.getElementById('medTime').value;
    if (med && time) {
        healthData.medications.push({
            date: new Date().toLocaleDateString(),
            medication: med,
            time: time
        });
        localStorage.setItem('healthData', JSON.stringify(healthData));
        document.getElementById('medication').value = '';
        document.getElementById('medTime').value = '';
    }
}

function updateHealthDisplay() {
    const today = new Date().toLocaleDateString();
    const todayWater = healthData.waterIntake
        .filter(w => w.date === today)
        .reduce((sum, w) => sum + w.amount, 0);
    
    const avgSleep = healthData.sleepHours.length > 0
        ? (healthData.sleepHours.reduce((sum, s) => sum + s.hours, 0) / healthData.sleepHours.length).toFixed(1)
        : 0;

    document.getElementById('waterTotal').textContent = todayWater.toFixed(1);
    document.getElementById('sleepAvg').textContent = avgSleep;
}

// ========== MENTAL HEALTH & STRESS ========== 
let mentalHealthData = JSON.parse(localStorage.getItem('mentalHealthData')) || {
    mood: [],
    stress: [],
    journal: []
};

function logMood(mood) {
    mentalHealthData.mood.push({
        date: new Date().toLocaleString(),
        mood: mood
    });
    localStorage.setItem('mentalHealthData', JSON.stringify(mentalHealthData));
    document.getElementById('latestMood').textContent = mood;
    updateDashboardStats();
}

function logStress() {
    const level = document.getElementById('stressLevel').value;
    mentalHealthData.stress.push({
        date: new Date().toLocaleString(),
        level: level
    });
    localStorage.setItem('mentalHealthData', JSON.stringify(mentalHealthData));
    updateDashboardStats();
}

document.getElementById('stressLevel')?.addEventListener('input', (e) => {
    document.getElementById('stressValue').textContent = e.target.value + '/10';
});

function startBreathingExercise() {
    const text = document.getElementById('breathingText');
    let cycle = 0;
    const cycles = ['Inhale...', 'Hold...', 'Exhale...'];
    
    const interval = setInterval(() => {
        text.textContent = cycles[cycle % 3];
        cycle++;
        
        if (cycle === 12) {
            clearInterval(interval);
            text.textContent = 'Breathing exercise completed!';
        }
    }, 2000);
}

function generateMotivationalTip() {
    const tips = [
        '🌟 You are stronger than you think. Take it one step at a time!',
        '💪 Every small progress is a victory. Celebrate your wins!',
        '🌈 Challenges are opportunities to grow. Embrace them!',
        '😊 Your mental health matters. Take care of yourself!',
        '🎯 Focus on what you can control and let go of the rest!',
        '💖 Be kind to yourself. You deserve compassion!',
        '✨ You have overcome 100% of your worst days. You\'re unstoppable!',
        '🚀 Your potential is limitless. Keep pushing forward!'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('motivationalTip').textContent = randomTip;
}

function saveJournalEntry() {
    const entry = document.getElementById('journalEntry').value;
    if (entry) {
        mentalHealthData.journal.push({
            date: new Date().toLocaleString(),
            entry: entry
        });
        localStorage.setItem('mentalHealthData', JSON.stringify(mentalHealthData));
        document.getElementById('journalEntry').value = '';
        
        const journalHistory = document.getElementById('journalHistory');
        const entryEl = document.createElement('div');
        entryEl.className = 'item';
        entryEl.innerHTML = `
            <div>
                <strong>${mentalHealthData.journal[mentalHealthData.journal.length - 1].date}</strong><br>
                ${entry}
            </div>
        `;
        journalHistory.appendChild(entryEl);
    }
}

// ========== DAILY LIFE MANAGEMENT ========== 
let dailyData = JSON.parse(localStorage.getItem('dailyData')) || {
    habits: [],
    notes: [],
    expenses: [],
    emergencyContacts: []
};

function addHabit() {
    const habitName = document.getElementById('habitName').value;
    if (habitName) {
        dailyData.habits.push({
            id: Date.now(),
            name: habitName,
            completed: false,
            createdDate: new Date().toLocaleDateString()
        });
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        document.getElementById('habitName').value = '';
        renderHabits();
        updateDashboardStats();
    }
}

function renderHabits() {
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';

    dailyData.habits.forEach(habit => {
        const habitEl = document.createElement('div');
        habitEl.className = 'item';
        habitEl.innerHTML = `
            <div>
                <strong>${habit.name}</strong>
            </div>
            <div>
                <input type="checkbox" ${habit.completed ? 'checked' : ''} onchange="toggleHabit(${habit.id})">
                <button onclick="deleteHabit(${habit.id})">Delete</button>
            </div>
        `;
        habitsList.appendChild(habitEl);
    });
}

function toggleHabit(id) {
    const habit = dailyData.habits.find(h => h.id === id);
    if (habit) {
        habit.completed = !habit.completed;
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        renderHabits();
        updateDashboardStats();
    }
}

function deleteHabit(id) {
    dailyData.habits = dailyData.habits.filter(h => h.id !== id);
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
    renderHabits();
    updateDashboardStats();
}

function addNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    if (title && content) {
        dailyData.notes.push({
            id: Date.now(),
            title: title,
            content: content,
            createdDate: new Date().toLocaleString()
        });
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        renderNotes();
    }
}

function renderNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    dailyData.notes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'item';
        noteEl.innerHTML = `
            <div>
                <strong>${note.title}</strong><br>
                ${note.content}<br>
                <small>${note.createdDate}</small>
            </div>
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(noteEl);
    });
}

function deleteNote(id) {
    dailyData.notes = dailyData.notes.filter(n => n.id !== id);
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
    renderNotes();
}

function addExpense() {
    const item = document.getElementById('expenseItem').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    if (item && amount > 0) {
        dailyData.expenses.push({
            id: Date.now(),
            item: item,
            amount: amount,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        document.getElementById('expenseItem').value = '';
        document.getElementById('expenseAmount').value = '';
        renderExpenses();
        updateDashboardStats();
    }
}

function renderExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    let totalExpenses = 0;
    dailyData.expenses.forEach(expense => {
        totalExpenses += expense.amount;
        const expenseEl = document.createElement('div');
        expenseEl.className = 'item';
        expenseEl.innerHTML = `
            <div>
                <strong>${expense.item}</strong> - ₱${expense.amount.toFixed(2)}<br>
                <small>${expense.date}</small>
            </div>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expensesList.appendChild(expenseEl);
    });

    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    const remainingBudget = 5000 - totalExpenses;
    document.getElementById('remainingBudget').textContent = remainingBudget.toFixed(2);
}

function deleteExpense(id) {
    dailyData.expenses = dailyData.expenses.filter(e => e.id !== id);
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
    renderExpenses();
    updateDashboardStats();
}

function addEmergencyContact() {
    const name = document.getElementById('contactPerson').value;
    const phone = document.getElementById('contactPhone').value;
    if (name && phone) {
        dailyData.emergencyContacts.push({
            id: Date.now(),
            name: name,
            phone: phone
        });
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        document.getElementById('contactPerson').value = '';
        document.getElementById('contactPhone').value = '';
        renderEmergencyContacts();
    }
}

function renderEmergencyContacts() {
    const contactsList = document.getElementById('emergencyContactsList');
    contactsList.innerHTML = '';

    dailyData.emergencyContacts.forEach(contact => {
        const contactEl = document.createElement('div');
        contactEl.className = 'item';
        contactEl.innerHTML = `
            <div>
                <strong>${contact.name}</strong><br>
                <a href="tel:${contact.phone}">${contact.phone}</a>
            </div>
            <button onclick="deleteContact(${contact.id})">Delete</button>
        `;
        contactsList.appendChild(contactEl);
    });
}

function deleteContact(id) {
    dailyData.emergencyContacts = dailyData.emergencyContacts.filter(c => c.id !== id);
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
    renderEmergencyContacts();
}

// ========== STUDENT SUPPORT SYSTEM ========== 
let supportData = JSON.parse(localStorage.getItem('supportData')) || {
    chat: [],
    community: []
};

function sendChatMessage() {
    const message = document.getElementById('chatMessage').value;
    if (message) {
        supportData.chat.push({
            user: localStorage.getItem('userName') || 'You',
            message: message,
            time: new Date().toLocaleTimeString()
        });
        localStorage.setItem('supportData', JSON.stringify(supportData));
        document.getElementById('chatMessage').value = '';
        renderChatBox();
    }
}

function renderChatBox() {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    supportData.chat.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.style.cssText = 'padding: 10px; margin: 5px 0; background: #e3f2fd; border-radius: 5px;';
        msgEl.innerHTML = `<strong>${msg.user}</strong> (${msg.time})<br>${msg.message}`;
        chatBox.appendChild(msgEl);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getAcademicEncouragement() {
    const messages = [
        'You\'re doing an amazing job! Keep up the hard work! 🎓',
        'Every challenge you face is making you stronger! 💪',
        'You have the skills and determination to succeed! ✨',
        'Your effort today will pay off tomorrow! 🚀',
        'Believe in yourself - you are capable of great things! 🌟'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('encouragementMessage').textContent = randomMessage;
}

function generateSelfCareRec() {
    const recommendations = [
        '💧 Stay hydrated! Drink more water today.',
        '😴 Get a good night\'s sleep. Your body needs rest.',
        '🧘 Try some meditation or deep breathing exercises.',
        '🏃 Take a walk or do some light exercise.',
        '📖 Read something inspirational or relaxing.',
        '☕ Take a break and enjoy your favorite beverage.',
        '🎵 Listen to your favorite music to uplift your mood.'
    ];
    
    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
    document.getElementById('selfCareRec').textContent = '📋 ' + randomRec;
}

function postToCommunity() {
    const post = document.getElementById('communityPost').value;
    if (post) {
        supportData.community.push({
            user: localStorage.getItem('userName') || 'Anonymous',
            post: post,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('supportData', JSON.stringify(supportData));
        document.getElementById('communityPost').value = '';
        renderCommunityBoard();
        updateDashboardStats();
    }
}

function renderCommunityBoard() {
    const board = document.getElementById('communityBoard');
    board.innerHTML = '';

    supportData.community.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'item';
        postEl.style.marginBottom = '1rem';
        postEl.innerHTML = `
            <div>
                <strong>${post.user}</strong> - ${post.time}<br>
                ${post.post}
            </div>
        `;
        board.appendChild(postEl);
    });
}

// ========== PROFILE ========== 
function saveProfile() {
    const nickname = document.getElementById('profileNickname').value;
    const name = document.getElementById('profileName').value;

    if (nickname && name) {
        localStorage.setItem('userName', nickname);
        document.getElementById('userGreeting').textContent = `Hi, ${nickname}`;
        alert('Profile updated successfully!');
    }
}

// ========== DASHBOARD NAVIGATION ========== 
function navigateDashboard(section) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
    showDashboardSection(section);
}

// ========== UPDATE DASHBOARD STATS ========== 
function updateDashboardStats() {
    // Tasks
    const completedTasks = tasks.filter(t => t.completed).length;
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = completedTasks;

    // Health
    const today = new Date().toLocaleDateString();
    const todayWater = healthData.waterIntake
        .filter(w => w.date === today)
        .reduce((sum, w) => sum + w.amount, 0);
    const avgSleep = healthData.sleepHours.length > 0
        ? (healthData.sleepHours.reduce((sum, s) => sum + s.hours, 0) / healthData.sleepHours.length).toFixed(1)
        : 0;
    document.getElementById('waterIntake').textContent = todayWater.toFixed(1);
    document.getElementById('sleepHours').textContent = avgSleep;

    // Daily
    const completedHabits = dailyData.habits.filter(h => h.completed).length;
    document.getElementById('habitsTracked').textContent = completedHabits;
    
    const totalExpenses = dailyData.expenses.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById('budget').textContent = (5000 - totalExpenses).toFixed(2);

    // Mental
    document.getElementById('moodEntries').textContent = mentalHealthData.mood.length;
    const avgStress = mentalHealthData.stress.length > 0
        ? (mentalHealthData.stress.reduce((sum, s) => parseInt(s.level), 0) / mentalHealthData.stress.length).toFixed(1)
        : 0;
    document.getElementById('avgStress').textContent = avgStress;

    // Support
    document.getElementById('communityPosts').textContent = supportData.community.length;
    document.getElementById('supportMessages').textContent = supportData.chat.length;
}

// ========== LOAD DASHBOARD DATA ========== 
function loadDashboardData() {
    renderTasks();
    renderHabits();
    renderNotes();
    renderExpenses();
    renderEmergencyContacts();
    renderChatBox();
    renderCommunityBoard();
    updateHealthDisplay();
    updateDashboardStats();
}

// ========== CONTACT FORM HANDLER ========== 
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.querySelector('.contact-form').reset();
}

// ========== CHECK IF USER IS LOGGED IN ========== 
window.addEventListener('load', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('dashboardPage').classList.add('active');
        document.getElementById('logoutNav').style.display = 'block';
        initializeDashboard();
    } else {
        document.getElementById('homePage').classList.add('active');
    }
});
