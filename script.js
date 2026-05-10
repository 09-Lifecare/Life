// ===========================
// INITIALIZATION & VARIABLES
// ===========================

const sections = {
    home: document.getElementById('home'),
    login: document.getElementById('login'),
    dashboard: document.getElementById('dashboard')
};

let currentUser = null;
let userData = {
    tasks: [],
    water: [],
    sleep: [],
    mood: [],
    stress: [],
    medications: [],
    meals: [],
    activities: [],
    habits: [],
    notes: [],
    contacts: [],
    journal: [],
    chat: []
};

// ===========================
// NAVIGATION & SECTION SWITCHING
// ===========================

function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    if (sections[sectionName]) {
        sections[sectionName].classList.add('active');
    }
}

// Navigation menu handling
document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Close mobile menu
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.remove('active');
        
        // Show appropriate section
        if (section === 'home') {
            showSection('home');
            window.scrollTo(0, 0);
        } else if (section === 'features') {
            showSection('home');
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        } else if (section === 'about') {
            showSection('home');
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        } else if (section === 'contact') {
            showSection('home');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================
// LOGIN/LOGOUT FUNCTIONALITY
// ===========================

const getStartedBtn = document.getElementById('getStartedBtn');
const loginForm = document.getElementById('loginForm');
const backBtn = document.getElementById('backBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutItem = document.getElementById('logoutItem');

getStartedBtn.addEventListener('click', () => {
    showSection('login');
    document.querySelector('.nav-link').classList.remove('active');
});

backBtn.addEventListener('click', () => {
    showSection('home');
    document.querySelector('.nav-link').classList.add('active');
    document.getElementById('loginError').style.display = 'none';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Basic validation
    if (email && password && role) {
        // Store user data in localStorage
        currentUser = {
            email: email,
            role: role,
            nickname: email.split('@')[0]
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('userData', JSON.stringify(userData));
        
        document.getElementById('loginError').style.display = 'none';
        showDashboard();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    currentUser = null;
    userData = {
        tasks: [],
        water: [],
        sleep: [],
        mood: [],
        stress: [],
        medications: [],
        meals: [],
        activities: [],
        habits: [],
        notes: [],
        contacts: [],
        journal: [],
        chat: []
    };
    
    logoutItem.style.display = 'none';
    showSection('home');
    document.querySelector('.nav-link').classList.add('active');
    loginForm.reset();
    document.getElementById('loginError').style.display = 'none';
});

// ===========================
// DASHBOARD FUNCTIONALITY
// ===========================

function showDashboard() {
    showSection('dashboard');
    logoutItem.style.display = 'block';
    
    if (localStorage.getItem('user')) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        userData = JSON.parse(localStorage.getItem('userData')) || userData;
    }
    
    updateUserGreeting();
    loadDashboardData();
    setupDashboardListeners();
}

function updateUserGreeting() {
    if (currentUser) {
        document.getElementById('userGreeting').textContent = `Hi, ${currentUser.nickname}`;
        document.getElementById('userRole').textContent = `(${currentUser.role})`;
    }
}

function loadDashboardData() {
    // Update dashboard cards
    document.getElementById('totalTasks').textContent = userData.tasks.length;
    document.getElementById('completedTasks').textContent = userData.tasks.filter(t => t.completed).length;
    document.getElementById('waterIntake').textContent = (userData.water.reduce((a, b) => a + parseFloat(b.amount || 0), 0)).toFixed(1) + 'L';
    document.getElementById('sleepHours').textContent = (userData.sleep.reduce((a, b) => a + parseFloat(b.hours || 0), 0)).toFixed(1) + 'h';
    document.getElementById('pendingTasks').textContent = userData.tasks.filter(t => !t.completed).length;
    document.getElementById('priorityTasks').textContent = userData.tasks.filter(t => t.priority === 'high').length;
    document.getElementById('todayShifts').textContent = userData.tasks.filter(t => t.type === 'shift').length;
    document.getElementById('upcomingEvents').textContent = userData.tasks.filter(t => t.type === 'event').length;
    
    // Load all data into respective sections
    loadClasses();
    loadTasks();
    loadWaterHistory();
    loadSleepHistory();
    loadMedications();
    loadMeals();
    loadActivities();
    loadHabits();
    loadNotes();
    loadContacts();
    loadMoodHistory();
    loadStressHistory();
    loadJournal();
    loadChat();
}

function setupDashboardListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const tab = e.currentTarget.getAttribute('data-tab');
            showTab(tab);
            
            // Close sidebar on mobile
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.remove('active');
        });
    });

    // Dashboard card navigation
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', () => {
            const cardType = card.getAttribute('data-card');
            const tabMap = {
                'academic': 'academic',
                'health': 'health',
                'tasks': 'academic',
                'budget': 'daily',
                'mental': 'mental',
                'schedule': 'academic'
            };
            
            const tab = tabMap[cardType];
            if (tab) {
                const link = document.querySelector(`[data-tab="${tab}"]`);
                if (link) link.click();
            }
        });
    });

    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Smart Academic Planner
    document.getElementById('addClassBtn')?.addEventListener('click', addClassInput);
    document.getElementById('addTaskBtn')?.addEventListener('click', addTaskInput);

    // Health & Wellness
    document.getElementById('addWaterBtn')?.addEventListener('click', addWater);
    document.getElementById('addSleepBtn')?.addEventListener('click', addSleep);
    document.getElementById('addMedicationBtn')?.addEventListener('click', addMedication);
    document.getElementById('addMealBtn')?.addEventListener('click', addMeal);
    document.getElementById('addActivityBtn')?.addEventListener('click', addActivity);

    // Mental Health
    document.querySelectorAll('.mood-btn')?.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            logMood(e.currentTarget.getAttribute('data-mood'));
        });
    });

    document.getElementById('stressSlider')?.addEventListener('input', (e) => {
        document.getElementById('stressValue').textContent = e.target.value + '/10';
    });

    document.getElementById('logStressBtn')?.addEventListener('click', logStress);
    document.getElementById('breathingBtn')?.addEventListener('click', startBreathingExercise);
    document.getElementById('getTipBtn')?.addEventListener('click', getMotivationalTip);
    document.getElementById('saveJournalBtn')?.addEventListener('click', saveJournal);

    // Daily Life
    document.getElementById('addHabitBtn')?.addEventListener('click', addHabit);
    document.getElementById('addNoteBtn')?.addEventListener('click', addNote);
    document.getElementById('addContactBtn')?.addEventListener('click', addContact);

    // Student Support
    document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
    document.getElementById('getRecommendationBtn')?.addEventListener('click', getRecommendation);
    document.getElementById('getEncouragementBtn')?.addEventListener('click', getEncouragement);

    // Profile
    document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
    
    if (currentUser) {
        document.getElementById('nicknameInput').value = currentUser.nickname;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profileRole').value = currentUser.role;
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    const tab = document.getElementById(tabName + '-tab');
    if (tab) {
        tab.classList.add('active');
    }
}

// ===========================
// SMART ACADEMIC PLANNER
// ===========================

function addClassInput() {
    const className = prompt('Enter class name:');
    if (className) {
        const classObj = {
            id: Date.now(),
            name: className,
            time: prompt('Enter class time:') || 'TBD'
        };
        userData.tasks.push({ ...classObj, type: 'class' });
        saveUserData();
        loadClasses();
    }
}

function loadClasses() {
    const classesList = document.getElementById('classesList');
    const classes = userData.tasks.filter(t => t.type === 'class');
    
    if (classes.length === 0) {
        classesList.innerHTML = '<p class="empty-message">No classes added yet. Click "Add Class" to get started.</p>';
        return;
    }
    
    classesList.innerHTML = classes.map(cls => `
        <div class="item">
            <div class="item-content">
                <strong>${cls.name}</strong> - ${cls.time}
            </div>
            <button class="item-delete" onclick="deleteItem(${cls.id})">Delete</button>
        </div>
    `).join('');
}

function addTaskInput() {
    const taskName = prompt('Enter task name:');
    if (taskName) {
        const priority = prompt('Enter priority (high/medium/low):') || 'medium';
        const taskObj = {
            id: Date.now(),
            name: taskName,
            priority: priority,
            completed: false,
            type: 'task'
        };
        userData.tasks.push(taskObj);
        saveUserData();
        loadTasks();
    }
}

function loadTasks() {
    const tasksList = document.getElementById('tasksList');
    const tasks = userData.tasks.filter(t => t.type === 'task');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-message">No tasks added yet. Click "Add Task" to get started.</p>';
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="item">
            <div class="item-content">
                <strong>${task.name}</strong> - Priority: ${task.priority}
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTaskComplete(${task.id})">
            </div>
            <button class="item-delete" onclick="deleteItem(${task.id})">Delete</button>
        </div>
    `).join('');
}

function toggleTaskComplete(id) {
    const task = userData.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveUserData();
        loadTasks();
        loadDashboardData();
    }
}

function deleteItem(id) {
    userData.tasks = userData.tasks.filter(t => t.id !== id);
    userData.water = userData.water.filter(w => w.id !== id);
    userData.sleep = userData.sleep.filter(s => s.id !== id);
    userData.mood = userData.mood.filter(m => m.id !== id);
    userData.stress = userData.stress.filter(s => s.id !== id);
    userData.medications = userData.medications.filter(m => m.id !== id);
    userData.meals = userData.meals.filter(m => m.id !== id);
    userData.activities = userData.activities.filter(a => a.id !== id);
    userData.habits = userData.habits.filter(h => h.id !== id);
    userData.notes = userData.notes.filter(n => n.id !== id);
    userData.contacts = userData.contacts.filter(c => c.id !== id);
    userData.journal = userData.journal.filter(j => j.id !== id);
    
    saveUserData();
    loadDashboardData();
}

// ===========================
// HEALTH & WELLNESS MONITORING
// ===========================

function addWater() {
    const amount = prompt('Enter water intake (in liters):');
    if (amount) {
        userData.water.push({
            id: Date.now(),
            amount: parseFloat(amount),
            date: new Date().toLocaleString()
        });
        saveUserData();
        loadWaterHistory();
        loadDashboardData();
    }
}

function loadWaterHistory() {
    const waterHistory = document.getElementById('waterHistory');
    if (userData.water.length === 0) {
        waterHistory.innerHTML = '<p style="font-size: 0.85rem; color: #999;">No water intake logged yet.</p>';
        return;
    }
    
    waterHistory.innerHTML = userData.water.map(w => `
        <div class="history-item">${w.amount}L - ${w.date}</div>
    `).join('');
}

function addSleep() {
    const hours = prompt('Enter sleep duration (in hours):');
    if (hours) {
        userData.sleep.push({
            id: Date.now(),
            hours: parseFloat(hours),
            date: new Date().toLocaleString()
        });
        saveUserData();
        loadSleepHistory();
        loadDashboardData();
    }
}

function loadSleepHistory() {
    const sleepHistory = document.getElementById('sleepHistory');
    if (userData.sleep.length === 0) {
        sleepHistory.innerHTML = '<p style="font-size: 0.85rem; color: #999;">No sleep data logged yet.</p>';
        return;
    }
    
    sleepHistory.innerHTML = userData.sleep.map(s => `
        <div class="history-item">${s.hours}h - ${s.date}</div>
    `).join('');
}

function addMedication() {
    const medication = document.getElementById('medicationInput').value;
    if (medication) {
        userData.medications.push({
            id: Date.now(),
            name: medication,
            date: new Date().toLocaleString()
        });
        document.getElementById('medicationInput').value = '';
        saveUserData();
        loadMedications();
    }
}

function loadMedications() {
    const medList = document.getElementById('medicationList');
    if (userData.medications.length === 0) {
        medList.innerHTML = '<p class="empty-message">No medications added.</p>';
        return;
    }
    
    medList.innerHTML = userData.medications.map(m => `
        <div class="item">
            <div class="item-content">${m.name}</div>
            <button class="item-delete" onclick="deleteItem(${m.id})">Delete</button>
        </div>
    `).join('');
}

function addMeal() {
    const meal = document.getElementById('mealInput').value;
    if (meal) {
        userData.meals.push({
            id: Date.now(),
            meal: meal,
            date: new Date().toLocaleString()
        });
        document.getElementById('mealInput').value = '';
        saveUserData();
        loadMeals();
    }
}

function loadMeals() {
    const mealList = document.getElementById('mealList');
    if (userData.meals.length === 0) {
        mealList.innerHTML = '<p class="empty-message">No meals logged.</p>';
        return;
    }
    
    mealList.innerHTML = userData.meals.map(m => `
        <div class="item">
            <div class="item-content">${m.meal} - ${m.date}</div>
            <button class="item-delete" onclick="deleteItem(${m.id})">Delete</button>
        </div>
    `).join('');
}

function addActivity() {
    const activity = document.getElementById('activityInput').value;
    if (activity) {
        userData.activities.push({
            id: Date.now(),
            activity: activity,
            date: new Date().toLocaleString()
        });
        document.getElementById('activityInput').value = '';
        saveUserData();
        loadActivities();
    }
}

function loadActivities() {
    const actList = document.getElementById('activityList');
    if (userData.activities.length === 0) {
        actList.innerHTML = '<p class="empty-message">No activities logged.</p>';
        return;
    }
    
    actList.innerHTML = userData.activities.map(a => `
        <div class="item">
            <div class="item-content">${a.activity} - ${a.date}</div>
            <button class="item-delete" onclick="deleteItem(${a.id})">Delete</button>
        </div>
    `).join('');
}

// ===========================
// MENTAL HEALTH & STRESS SUPPORT
// ===========================

function logMood(mood) {
    userData.mood.push({
        id: Date.now(),
        mood: mood,
        date: new Date().toLocaleString()
    });
    
    // Update current mood on dashboard
    document.getElementById('currentMood').textContent = mood;
    
    saveUserData();
    loadMoodHistory();
}

function loadMoodHistory() {
    const moodHistory = document.getElementById('moodHistory');
    if (userData.mood.length === 0) {
        moodHistory.innerHTML = '<p style="font-size: 0.85rem; color: #999;">No mood logged yet.</p>';
        return;
    }
    
    moodHistory.innerHTML = userData.mood.slice(-5).map(m => `
        <div class="history-item">${m.mood} - ${m.date}</div>
    `).join('');
}

function logStress() {
    const stressLevel = document.getElementById('stressSlider').value;
    userData.stress.push({
        id: Date.now(),
        level: parseInt(stressLevel),
        date: new Date().toLocaleString()
    });
    
    // Update current stress level on dashboard
    document.getElementById('stressLevel').textContent = stressLevel + '/10';
    
    saveUserData();
    loadStressHistory();
}

function loadStressHistory() {
    const stressHistory = document.getElementById('stressHistory');
    if (userData.stress.length === 0) {
        stressHistory.innerHTML = '<p style="font-size: 0.85rem; color: #999;">No stress data logged yet.</p>';
        return;
    }
    
    stressHistory.innerHTML = userData.stress.slice(-5).map(s => `
        <div class="history-item">Level ${s.level}/10 - ${s.date}</div>
    `).join('');
}

function startBreathingExercise() {
    alert('🧘 5-Minute Breathing Exercise Started!\n\n1. Breathe in for 4 counts\n2. Hold for 4 counts\n3. Breathe out for 4 counts\n\nRepeat this 5 times. Focus on your breath and let stress melt away.');
}

function getMotivationalTip() {
    const tips = [
        '💪 You are capable of amazing things. Believe in yourself!',
        '🌟 Every small step counts. Keep moving forward!',
        '❤️ Take care of yourself. You deserve it!',
        '🎯 Focus on what you can control. Let go of the rest.',
        '✨ You are doing better than you think you are!',
        '🌈 This challenging moment will pass. Stay strong!',
        '📚 Learning never stops. Embrace the journey!',
        '🏆 Success is not final, failure is not fatal. Keep trying!'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('motivationalTip').textContent = randomTip;
}

function saveJournal() {
    const entry = document.getElementById('journalEntry').value;
    if (entry.trim()) {
        userData.journal.push({
            id: Date.now(),
            entry: entry,
            date: new Date().toLocaleString()
        });
        document.getElementById('journalEntry').value = '';
        saveUserData();
        loadJournal();
    }
}

function loadJournal() {
    const journalList = document.getElementById('journalList');
    if (userData.journal.length === 0) {
        journalList.innerHTML = '<p class="empty-message">No journal entries yet. Start reflecting!</p>';
        return;
    }
    
    journalList.innerHTML = userData.journal.slice().reverse().map(j => `
        <div class="item">
            <div class="item-content">
                <strong>${j.date}</strong><br>${j.entry}
            </div>
            <button class="item-delete" onclick="deleteItem(${j.id})">Delete</button>
        </div>
    `).join('');
}

// ===========================
// DAILY LIFE MANAGEMENT
// ===========================

function addHabit() {
    const habit = document.getElementById('habitInput').value;
    if (habit) {
        userData.habits.push({
            id: Date.now(),
            habit: habit,
            completed: false,
            date: new Date().toLocaleDateString()
        });
        document.getElementById('habitInput').value = '';
        saveUserData();
        loadHabits();
    }
}

function loadHabits() {
    const habitList = document.getElementById('habitList');
    if (userData.habits.length === 0) {
        habitList.innerHTML = '<p class="empty-message">No habits tracked yet.</p>';
        return;
    }
    
    habitList.innerHTML = userData.habits.map(h => `
        <div class="item">
            <div class="item-content">
                <input type="checkbox" ${h.completed ? 'checked' : ''} 
                    onchange="toggleHabit(${h.id})">
                <span style="text-decoration: ${h.completed ? 'line-through' : 'none'}">${h.habit}</span>
            </div>
            <button class="item-delete" onclick="deleteItem(${h.id})">Delete</button>
        </div>
    `).join('');
}

function toggleHabit(id) {
    const habit = userData.habits.find(h => h.id === id);
    if (habit) {
        habit.completed = !habit.completed;
        saveUserData();
        loadHabits();
    }
}

function addNote() {
    const noteText = document.getElementById('noteInput').value;
    if (noteText) {
        userData.notes.push({
            id: Date.now(),
            note: noteText,
            date: new Date().toLocaleString()
        });
        document.getElementById('noteInput').value = '';
        saveUserData();
        loadNotes();
    }
}

function loadNotes() {
    const notesList = document.getElementById('notesList');
    if (userData.notes.length === 0) {
        notesList.innerHTML = '<p class="empty-message">No notes saved yet.</p>';
        return;
    }
    
    notesList.innerHTML = userData.notes.slice().reverse().map(n => `
        <div class="item">
            <div class="item-content">
                <strong>${n.date}</strong><br>${n.note}
            </div>
            <button class="item-delete" onclick="deleteItem(${n.id})">Delete</button>
        </div>
    `).join('');
}

function addContact() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    
    if (name && phone) {
        userData.contacts.push({
            id: Date.now(),
            name: name,
            phone: phone
        });
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        saveUserData();
        loadContacts();
    }
}

function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    if (userData.contacts.length === 0) {
        contactsList.innerHTML = '<p class="empty-message">No emergency contacts saved.</p>';
        return;
    }
    
    contactsList.innerHTML = userData.contacts.map(c => `
        <div class="item">
            <div class="item-content">
                <strong>${c.name}</strong><br><a href="tel:${c.phone}">${c.phone}</a>
            </div>
            <button class="item-delete" onclick="deleteItem(${c.id})">Delete</button>
        </div>
    `).join('');
}

// ===========================
// STUDENT SUPPORT SYSTEM
// ===========================

function sendMessage() {
    const message = document.getElementById('chatMessage').value;
    if (message.trim()) {
        userData.chat.push({
            id: Date.now(),
            user: currentUser.nickname,
            message: message,
            timestamp: new Date().toLocaleTimeString()
        });
        document.getElementById('chatMessage').value = '';
        saveUserData();
        loadChat();
    }
}

function loadChat() {
    const chatHistory = document.getElementById('chatHistory');
    if (userData.chat.length === 0) {
        chatHistory.innerHTML = '<p style="text-align: center; color: #999;">Start a conversation!</p>';
        return;
    }
    
    chatHistory.innerHTML = userData.chat.slice().reverse().map(c => `
        <div class="chat-item">
            <strong>${c.user}</strong> <small>${c.timestamp}</small>
            <p>${c.message}</p>
        </div>
    `).join('');
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function getRecommendation() {
    const recommendations = [
        '🧘 Try a 10-minute meditation session to reduce stress.',
        '🚶 Take a short walk outside to refresh your mind.',
        '📖 Read something inspiring or take a hobby break.',
        '💤 Ensure you get 7-9 hours of sleep tonight.',
        '🥗 Focus on eating balanced meals with fruits and vegetables.',
        '📱 Reduce screen time and take regular breaks.',
        '🤝 Reach out to a friend or family member for support.',
        '🎵 Listen to your favorite music to uplift your mood.'
    ];
    
    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
    const recElement = document.getElementById('recommendation');
    recElement.textContent = randomRec;
    recElement.style.display = 'block';
}

function getEncouragement() {
    const encouragements = [
        '🌟 You\'ve come so far. Be proud of yourself!',
        '💪 You are stronger than you think you are.',
        '🎯 Your goals are within reach. Keep pushing!',
        '✨ Every day is a new opportunity to succeed.',
        '🏆 Hard work and dedication pay off in the end.',
        '❤️ You are worthy of success and happiness.',
        '🌈 Challenges are just opportunities in disguise.',
        '📚 Your education is an investment in your future.'
    ];
    
    const randomEnc = encouragements[Math.floor(Math.random() * encouragements.length)];
    document.getElementById('encouragement').textContent = randomEnc;
}

// ===========================
// PROFILE MANAGEMENT
// ===========================

function saveProfile() {
    const nickname = document.getElementById('nicknameInput').value;
    if (nickname && currentUser) {
        currentUser.nickname = nickname;
        localStorage.setItem('user', JSON.stringify(currentUser));
        updateUserGreeting();
        alert('Profile updated successfully!');
    }
}

// ===========================
// DATA PERSISTENCE
// ===========================

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}

// ===========================
// HAMBURGER MENU
// ===========================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ===========================
// INITIALIZATION
// ===========================

// Check if user is already logged in
window.addEventListener('load', () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        userData = JSON.parse(localStorage.getItem('userData')) || userData;
        showDashboard();
    } else {
        showSection('home');
    }
});

// Prevent back button issues after login
window.addEventListener('beforeunload', () => {
    if (currentUser && !document.hidden) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('userData', JSON.stringify(userData));
    }
});
