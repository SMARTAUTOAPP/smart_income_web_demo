// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Show welcome modal on first visit
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    if (!localStorage.getItem('welcomeShown')) {
        welcomeModal.show();
        localStorage.setItem('welcomeShown', 'true');
    }

    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section, hide others
            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('d-none');
                    // Update page title
                    document.title = `${section.dataset.title} - تطبيق إدارة الدخل الذكي`;
                } else {
                    section.classList.add('d-none');
                }
            });
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    if (localStorage.getItem('darkTheme') === 'true') {
        document.documentElement.classList.add('dark-theme');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
    }
    
    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-theme');
        
        // Update icon
        if (document.documentElement.classList.contains('dark-theme')) {
            themeIcon.classList.remove('bi-moon-fill');
            themeIcon.classList.add('bi-sun-fill');
            localStorage.setItem('darkTheme', 'true');
        } else {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
            localStorage.setItem('darkTheme', 'false');
        }
    });

    // Add Transaction Button
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const addTransactionModal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    
    addTransactionBtn.addEventListener('click', function() {
        addTransactionModal.show();
    });

    // Smart Category Classification
    const transactionDescription = document.getElementById('transactionDescription');
    const transactionCategory = document.getElementById('transactionCategory');
    const smartCategoryBadge = document.getElementById('smartCategoryBadge');
    
    transactionDescription.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            // Simulate AI classification with a delay
            setTimeout(() => {
                const description = this.value.toLowerCase();
                let category = '';
                
                // Simple keyword-based classification
                if (description.includes('راتب') || description.includes('مرتب') || description.includes('معاش')) {
                    category = 'راتب';
                } else if (description.includes('طعام') || description.includes('سوبرماركت') || description.includes('بقالة')) {
                    category = 'طعام';
                } else if (description.includes('مطعم') || description.includes('كافيه') || description.includes('عشاء')) {
                    category = 'مطاعم';
                } else if (description.includes('فاتورة') || description.includes('كهرباء') || description.includes('ماء') || description.includes('انترنت')) {
                    category = 'فواتير';
                } else if (description.includes('سيارة') || description.includes('بنزين') || description.includes('تاكسي') || description.includes('مواصلات')) {
                    category = 'مواصلات';
                } else if (description.includes('ترفيه') || description.includes('سينما') || description.includes('لعبة')) {
                    category = 'ترفيه';
                } else if (description.includes('ملابس') || description.includes('تسوق') || description.includes('شراء')) {
                    category = 'تسوق';
                }
                
                if (category !== '') {
                    transactionCategory.value = category;
                    smartCategoryBadge.style.display = 'inline';
                }
            }, 500);
        }
    });

    // Add Transaction Form Submission
    const addTransactionForm = document.getElementById('addTransactionForm');
    const transactionAddedToast = new bootstrap.Toast(document.getElementById('transactionAddedToast'));
    
    addTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate adding transaction
        addTransactionModal.hide();
        
        // Show success toast
        transactionAddedToast.show();
        
        // Reset form
        this.reset();
        smartCategoryBadge.style.display = 'none';
    });

    // Initialize Charts
    initializeCharts();

    // Initialize Smart Budget Recommendations
    initializeSmartRecommendations();

    // Budget Sliders
    const budgetSliders = document.querySelectorAll('.budget-slider');
    
    budgetSliders.forEach(slider => {
        const valueDisplay = document.getElementById(`${slider.id}Value`);
        
        slider.addEventListener('input', function() {
            valueDisplay.textContent = `${this.value} ريال`;
            updateBudgetRecommendations();
        });
    });

    // Prediction Scenario Change
    const predictionScenario = document.getElementById('predictionScenario');
    
    predictionScenario.addEventListener('change', function() {
        updatePredictionChart(this.value);
    });
});

// Initialize Charts
function initializeCharts() {
    // Expense Distribution Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: ['طعام', 'مواصلات', 'فواتير', 'ترفيه', 'تسوق', 'أخرى'],
            datasets: [{
                data: [25, 15, 20, 10, 20, 10],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#9b59b6',
                    '#e74c3c',
                    '#95a5a6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });

    // Income vs Expense Chart
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    const incomeExpenseChart = new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'],
            datasets: [
                {
                    label: 'الدخل',
                    data: [12000, 12500, 12000, 13500, 13700],
                    backgroundColor: '#2ecc71',
                    borderWidth: 0
                },
                {
                    label: 'المصروفات',
                    data: [9500, 10200, 9800, 9200, 8750],
                    backgroundColor: '#e74c3c',
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });

    // Prediction Chart
    const predictionCtx = document.getElementById('predictionChart').getContext('2d');
    window.predictionChart = new Chart(predictionCtx, {
        type: 'line',
        data: {
            labels: ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر'],
            datasets: [
                {
                    label: 'الدخل المتوقع',
                    data: [13800, 13900, 14000, 14100, 14200, 14300],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'المصروفات المتوقعة',
                    data: [8700, 8650, 8600, 8550, 8500, 8450],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'المدخرات المتوقعة',
                    data: [5100, 5250, 5400, 5550, 5700, 5850],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });

    // Budget Distribution Chart
    const budgetDistributionCtx = document.getElementById('budgetDistributionChart').getContext('2d');
    const budgetDistributionChart = new Chart(budgetDistributionCtx, {
        type: 'pie',
        data: {
            labels: ['طعام ومشروبات', 'مواصلات', 'فواتير وخدمات', 'ترفيه', 'ادخار', 'أخرى'],
            datasets: [{
                data: [2000, 800, 1500, 600, 2500, 1100],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c',
                    '#95a5a6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });

    // Advanced Prediction Chart
    const advancedPredictionCtx = document.getElementById('advancedPredictionChart').getContext('2d');
    const advancedPredictionChart = new Chart(advancedPredictionCtx, {
        type: 'line',
        data: {
            labels: ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر'],
            datasets: [
                {
                    label: 'الدخل المتوقع',
                    data: [13800, 13900, 14000, 14100, 14200, 14300],
                    borderColor: '#2ecc71',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'المصروفات المتوقعة',
                    data: [8700, 8650, 8600, 8550, 8500, 8450],
                    borderColor: '#e74c3c',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'المدخرات المتوقعة',
                    data: [5100, 5250, 5400, 5550, 5700, 5850],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });

    // Savings Prediction Chart
    const savingsPredictionCtx = document.getElementById('savingsPredictionChart').getContext('2d');
    const savingsPredictionChart = new Chart(savingsPredictionCtx, {
        type: 'line',
        data: {
            labels: ['الوضع الحالي', 'بعد شهر', 'بعد 3 أشهر', 'بعد 6 أشهر', 'بعد سنة'],
            datasets: [
                {
                    label: 'المدخرات بدون تطبيق التوصيات',
                    data: [15000, 20000, 30000, 45000, 75000],
                    borderColor: '#95a5a6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4
                },
                {
                    label: 'المدخرات مع تطبيق التوصيات',
                    data: [15000, 21250, 33750, 52500, 90000],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });
}

// Update Prediction Chart based on selected scenario
function updatePredictionChart(scenario) {
    let incomeData, expenseData, savingsData;
    let analysisText = '';
    
    switch(scenario) {
        case 'optimistic':
            incomeData = [13800, 14000, 14200, 14500, 14800, 15000];
            expenseData = [8700, 8600, 8500, 8400, 8300, 8200];
            savingsData = [5100, 5400, 5700, 6100, 6500, 6800];
            analysisText = 'تحليل ذكي: في السيناريو المتفائل، نتوقع زيادة في المدخرات بنسبة 25% خلال الستة أشهر القادمة بسبب زيادة الدخل وانخفاض المصاريف.';
            break;
        case 'pessimistic':
            incomeData = [13800, 13700, 13600, 13500, 13400, 13300];
            expenseData = [8700, 8800, 8900, 9000, 9100, 9200];
            savingsData = [5100, 4900, 4700, 4500, 4300, 4100];
            analysisText = 'تحليل ذكي: في السيناريو المتشائم، نتوقع انخفاض في المدخرات بنسبة 20% خلال الستة أشهر القادمة بسبب انخفاض الدخل وزيادة المصاريف.';
            break;
        default: // realistic
            incomeData = [13800, 13900, 14000, 14100, 14200, 14300];
            expenseData = [8700, 8650, 8600, 8550, 8500, 8450];
            savingsData = [5100, 5250, 5400, 5550, 5700, 5850];
            analysisText = 'تحليل ذكي: بناءً على أنماط الدخل والإنفاق السابقة، نتوقع زيادة في المدخرات بنسبة 12% خلال الثلاثة أشهر القادمة إذا حافظت على نمط الإنفاق الحالي.';
    }
    
    window.predictionChart.data.datasets[0].data = incomeData;
    window.predictionChart.data.datasets[1].data = expenseData;
    window.predictionChart.data.datasets[2].data = savingsData;
    window.predictionChart.update();
    
    document.getElementById('predictionAnalysis').innerHTML = `<strong>تحليل ذكي:</strong> ${analysisText}`;
}

// Initialize Smart Recommendations
function initializeSmartRecommendations() {
    const smartRecommendations = document.getElementById('smartRecommendations');
    
    const recommendations = [
        {
            type: 'warning',
            title: 'فرصة توفير',
            content: 'يمكنك توفير 15% من مصاريف الطعام عن طريق التخطيط المسبق للوجبات الأسبوعية وشراء المواد الغذائية بكميات أكبر.'
        },
        {
            type: 'info',
            title: 'نصيحة ذكية',
            content: 'بناءً على أنماط إنفاقك، ننصح بزيادة ميزانية المواصلات بنسبة 10% لتغطية الزيادة المتوقعة في أسعار الوقود.'
        },
        {
            type: 'success',
            title: 'فرصة ادخار',
            content: 'يمكنك زيادة مدخراتك بنسبة 20% عن طريق تحويل مبلغ ثابت تلقائياً إلى حساب التوفير فور استلام الراتب.'
        }
    ];
    
    let recommendationsHTML = '';
    
    recommendations.forEach(rec => {
        recommendationsHTML += `
            <div class="alert alert-${rec.type} mb-3">
                <strong>${rec.title}:</strong> ${rec.content}
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-${rec.type === 'warning' ? 'dark' : rec.type}">تطبيق التوصية</button>
                    <button class="btn btn-sm btn-link">تجاهل</button>
                </div>
            </div>
        `;
    });
    
    smartRecommendations.innerHTML = recommendationsHTML;
}

// Update Budget Recommendations based on slider changes
function updateBudgetRecommendations() {
    // This function would normally analyze the budget allocations
    // and provide dynamic recommendations based on the changes
    
    // For demo purposes, we'll just simulate a delay and then update the recommendations
    setTimeout(() => {
        const foodBudget = document.getElementById('foodBudget').value;
        const transportBudget = document.getElementById('transportBudget').value;
        const savingsBudget = document.getElementById('savingsBudget').value;
        
        const smartRecommendations = document.getElementById('smartRecommendations');
        
        let recommendationsHTML = '';
        
        if (parseInt(foodBudget) > 2500) {
            recommendationsHTML += `
                <div class="alert alert-warning mb-3">
                    <strong>فرصة توفير:</strong> ميزانية الطعام مرتفعة نسبياً. يمكنك توفير حوالي ${Math.round((parseInt(foodBudget) - 2500) * 0.7)} ريال شهرياً بتقليلها إلى 2500 ريال.
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-dark">تطبيق التوصية</button>
                        <button class="btn btn-sm btn-link">تجاهل</button>
                    </div>
                </div>
            `;
        }
        
        if (parseInt(transportBudget) < 600) {
            recommendationsHTML += `
                <div class="alert alert-info mb-3">
                    <strong>نصيحة ذكية:</strong> ميزانية المواصلات منخفضة جداً. ننصح بزيادتها إلى 600 ريال على الأقل لتغطية المصاريف المتوقعة.
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-info">تطبيق التوصية</button>
                        <button class="btn btn-sm btn-link">تجاهل</button>
                    </div>
                </div>
            `;
        }
        
        if (parseInt(savingsBudget) < 2000) {
            recommendationsHTML += `
                <div class="alert alert-danger mb-3">
                    <strong>تحذير:</strong> ميزانية الادخار منخفضة جداً. ننصح بزيادتها إلى 2000 ريال على الأقل لتحقيق أهدافك المالية.
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-danger">تطبيق التوصية</button>
                        <button class="btn btn-sm btn-link">تجاهل</button>
                    </div>
                </div>
            `;
        } else if (parseInt(savingsBudget) >= 3000) {
            recommendationsHTML += `
                <div class="alert alert-success mb-3">
                    <strong>تهانينا:</strong> ميزانية الادخار ممتازة! ستتمكن من تحقيق هدفك المالي قبل الموعد المحدد بـ ${Math.round((parseInt(savingsBudget) - 2000) / 100)} أشهر.
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-success">عرض خطة الادخار</button>
                    </div>
                </div>
            `;
        }
        
        if (recommendationsHTML === '') {
            recommendationsHTML = `
                <div class="alert alert-success mb-3">
                    <strong>ممتاز:</strong> توزيع الميزانية الحالي متوازن ومناسب لأهدافك المالية.
                </div>
            `;
        }
        
        smartRecommendations.innerHTML = recommendationsHTML;
    }, 500);
}

// Simulate dynamic recommendations
setInterval(() => {
    const dynamicRecommendations = document.getElementById('dynamicRecommendations');
    if (!dynamicRecommendations) return;
    
    const recommendations = [
        '<strong><i class="bi bi-exclamation-triangle me-2"></i> تنبيه ذكي:</strong> لاحظنا زيادة في مصاريف المطاعم بنسبة 20% هذا الشهر. يمكنك توفير حوالي 450 ريال شهرياً بتقليل الوجبات الخارجية.',
        '<strong><i class="bi bi-info-circle me-2"></i> نصيحة ذكية:</strong> يمكنك توفير 300 ريال شهرياً بتغيير باقة الاتصالات الحالية إلى الباقة الموصى بها بناءً على نمط استخدامك.',
        '<strong><i class="bi bi-check-circle me-2"></i> فرصة توفير:</strong> بناءً على أنماط إنفاقك، يمكنك توفير 15% من مصاريف التسوق باستخدام كوبونات الخصم المتاحة حالياً.',
        '<strong><i class="bi bi-lightbulb me-2"></i> اقتراح ذكي:</strong> وفقاً لتحليل أنماط الإنفاق، يمكنك توفير 200 ريال شهرياً بإعداد القهوة في المنزل بدلاً من شرائها من المقاهي.',
        '<strong><i class="bi bi-graph-up me-2"></i> فرصة استثمار:</strong> لديك فائض نقدي يمكن استثماره في صندوق استثماري منخفض المخاطر بعائد سنوي متوقع 5-7%.'
    ];
    
    // Randomly select a recommendation
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-' + ['warning', 'info', 'success'][Math.floor(Math.random() * 3)];
    alertElement.innerHTML = recommendations[randomIndex];
    
    // Replace a random existing recommendation
    const existingAlerts = dynamicRecommendations.querySelectorAll('.alert');
    if (existingAlerts.length > 0) {
        const randomAlertIndex = Math.floor(Math.random() * existingAlerts.length);
        dynamicRecommendations.replaceChild(alertElement, existingAlerts[randomAlertIndex]);
    }
}, 30000); // Change every 30 seconds
