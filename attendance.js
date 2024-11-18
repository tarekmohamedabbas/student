// الطلاب وبيانات الحضور
const studentsDatabase = [
    { id: "123", name: "أحمد", email: "ahmed@example.com" },
    { id: "124", name: "محمود", email: "mahmoud@example.com" },
    { id: "125", name: "مريم", email: "mariam@example.com" },
    { id: "126", name: "سارة", email: "sarah@example.com" }
];

// بيانات الحضور والانصراف
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
let departureData = JSON.parse(localStorage.getItem('departureData')) || {};

// دالة لعرض الإشعار المنبثق
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // اختفاء الإشعار بعد 3 ثواني
}

// دالة لتحديث الجدول
function updateAttendanceTable(day, studentId, studentName, time, status) {
    const tableBody = document.getElementById(`${day}TableBody`);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${studentName}</td>
        <td>${studentId}</td>
        <td>${time}</td>
        <td class="${status === 'حضور' ? 'green' : 'red'}">${status}</td>
    `;
    
    tableBody.appendChild(row);
}

// دالة لعرض بيانات الحضور والانصراف
function displayAttendanceAndDeparture(day) {
    const tableBody = document.getElementById(`${day}TableBody`);
    tableBody.innerHTML = ''; // تفريغ الجدول

    if (attendanceData[day]) {
        attendanceData[day].forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.time}</td>
                <td class="${student.status === 'حضور' ? 'green' : 'red'}">${student.status}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="4">لا توجد بيانات لعرضها.</td></tr>`;
    }
}

// دالة العد التنازلي
function startCountdown(deadline) {
    const countdownElement = document.getElementById('countdown');
    
    const interval = setInterval(function() {
        const now = new Date();
        const timeLeft = deadline - now;

        if (timeLeft <= 0) {
            countdownElement.innerHTML = 'انتهى الوقت!';
            clearInterval(interval); // إيقاف العداد
        } else {
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
            countdownElement.innerHTML = `الوقت المتبقي: ${minutesLeft} دقيقة و ${secondsLeft} ثانية`;
        }
    }, 1000);
}

// العد التنازلي (مثال: الساعة 1:00 مساءً)
const deadline = new Date(); 
deadline.setHours(17, 0, 0, 0);   // 1:00 مساءً اخرك
startCountdown(deadline);

// أوقات الحضور والانصراف
const attendanceStartTime = new Date();
attendanceStartTime.setHours(14, 0, 0, 0);  // 8:00 صباحًا بدايه

const attendanceEndTime = new Date();
attendanceEndTime.setHours(16, 0, 0, 0);  // 1:00 ظهرًا نهايه حضورك

// اخرك 22 بعد كدا 11

// التعامل مع تسجيل الحضور
document.getElementById('submitAttendance').addEventListener('click', function () {
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;

    const student = studentsDatabase.find(s => s.id === studentId && s.name === studentName);

    if (student) {
        const today = new Date().toLocaleString("en-US", { weekday: "long" });
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTimeFormatted = `${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}`;

        if (!attendanceData[today]) {
            attendanceData[today] = [];
        }

        const alreadyAttended = attendanceData[today].some(student => student.id === studentId);
        if (alreadyAttended) {
            showNotification('لقد قمت بتسجيل الحضور لهذا اليوم مسبقًا.', 'error');
        } else {
            if (currentTime < attendanceStartTime || currentTime > attendanceEndTime) {
                showNotification('لقد انتهى وقت الحضور. يمكنك التسجيل فقط بين الساعة 2:00 صباحًا و 1:00 ظهرًا.', 'error');
            } else {
                const status = (currentHour < 13) ? 'حضور' : 'غائب';
                attendanceData[today].push({
                    id: studentId,
                    name: studentName,
                    time: currentTimeFormatted,
                    status: status
                });

                localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                updateAttendanceTable(today, studentId, studentName, currentTimeFormatted, status);
                showNotification('تم تسجيل الحضور بنجاح!', 'success');
            }
        }
    } else {
        showNotification('خطأ في ID أو الاسم، يرجى المحاولة مجددًا!', 'error');
    }
});


// style
// الحصول على الكائن الذي سيتبع الماوس
const cursor = document.querySelector('.cursor');

// تعقب حركة الماوس
document.addEventListener('mousemove', (e) => {
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    // تحديث موقع الكائن (الدائرة) ليتبع الماوس
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    // إضافة class لإضاءة الكائن فقط عند مرور الماوس
    document.body.classList.add('mouse-over');
});

// إزالة التأثير بعد توقف الماوس عن الحركة
document.addEventListener('mouseleave', () => {
    document.body.classList.remove('mouse-over');
});

document.querySelectorAll('.circle').forEach(circle => {
    const randomTop = Math.random() * 100;  // موقع عشوائي أفقي
    const randomLeft = Math.random() * 100; // موقع عشوائي عمودي
    const randomDelay = Math.random() * 5;  // تأخير عشوائي للحركة
    circle.style.top = `${randomTop}vh`;  // تعيين الموقع العمودي
    circle.style.left = `${randomLeft}vw`;  // تعيين الموقع الأفقي
    circle.style.animationDelay = `${randomDelay}s`;  // تأخير العداد العشوائي
});

// إنشاء الشهب بشكل عشوائي في الموقع
for (let i = 0; i < 50; i++) {  // تحديد عدد الشهب
    let snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * 100 + 'vw';  // وضع الشهب في مواقع عشوائية
    snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';  // تعيين سرعة الحركة بشكل عشوائي
    snowflake.style.animationDelay = Math.random() * 5 + 's';  // تأخير عشوائي للحركة
    document.body.appendChild(snowflake);
}
