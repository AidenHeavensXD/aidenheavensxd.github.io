document.addEventListener('DOMContentLoaded', function() {
    // Day color theme based on new color scheme
    const highlightElement = document.querySelector('.highlight');
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayColors = [
        '#FF0000', // อาทิตย์ - สีแดง
        '#FFFF00', // จันทร์ - สีเหลือง
        '#FFC0CB', // อังคาร - สีชมพู
        '#00FF00', // พุธ - สีเขียว
        '#FFA500', // พฤหัสบดี - สีส้ม
        '#00FFFF', // ศุกร์ - สีฟ้า
        '#800080'  // เสาร์ - สีม่วง
    ]
    const today = new Date();
    const dayOfWeek = today.getDay()
    highlightElement.textContent = days[dayOfWeek];
    highlightElement.style.color = dayColors[dayOfWeek]
    // Welcome Video Handler
    const introOverlay = document.getElementById('introOverlay');
    const introVideo = document.getElementById('introVideo');
    const skipButton = document.getElementById('skipIntro');
    const muteButton = document.getElementById('muteBtn');
    const playPauseButton = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('videoProgress');
    
    // Initialize video controls
    let isMuted = true;
    let volumeLevel = 0.5; // Default volume level
    introVideo.volume = volumeLevel;
    
    // Update progress bar
    introVideo.addEventListener('timeupdate', function() {
        const progress = (introVideo.currentTime / introVideo.duration) * 100;
        progressBar.style.width = progress + '%';
    });
    
    // Mute button functionality
    muteButton.addEventListener('click', function() {
        if (introVideo.muted) {
            introVideo.muted = false;
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMuted = false;
        } else {
            introVideo.muted = true;
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            isMuted = true;
        }
    });
    
    // Play/Pause button functionality
    playPauseButton.addEventListener('click', function() {
        if (introVideo.paused) {
            introVideo.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            introVideo.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Unmute video when user interacts with the page
    document.addEventListener('click', function() {
        if (isMuted) {
            introVideo.muted = false;
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMuted = false;
        }
    }, { once: true })
    // Skip button handler
    skipButton.addEventListener('click', function() {
        introOverlay.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            introOverlay.remove();
        }, 500);
    })
    // Remove overlay container when video ends
    introVideo.addEventListener('ended', function() {
        introOverlay.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            introOverlay.remove();
        }, 500);
    })
    // Enhanced hover effects for social icons
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
            icon.style.color = '#ffffff'; // White text on hover
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.style.color = '#ccdcec'; // Return to primary color
        });
    })
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (introOverlay && introOverlay.style.display !== 'none') {
            switch(e.key) {
                case 'Escape':
                    // Skip intro on ESC key
                    skipButton.click();
                    break;
                case 'ArrowUp':
                    // Increase volume
                    volumeLevel = Math.min(1, volumeLevel + 0.1);
                    introVideo.volume = volumeLevel;
                    break;
                case 'ArrowDown':
                    // Decrease volume
                    volumeLevel = Math.max(0, volumeLevel - 0.1);
                    introVideo.volume = volumeLevel;
                    break;
                case 'm':
                    // Mute/unmute
                    muteButton.click();
                    break;
                case ' ':
                case 'k':
                    // Play/Pause on space or k
                    playPauseButton.click();
                    e.preventDefault();
                    break;
            }
        }
    });

    // Discord Status Handler
    const discordUserId = '1286107925638676501'; // ID ผู้ใช้ Discord ของคุณ
    const lanyardApiUrl = `https://api.lanyard.rest/v1/users/1286107925638676501`;

    const discordAvatar = document.getElementById('discord-avatar');
    const discordName = document.getElementById('discord-name');
    const discordStatusText = document.getElementById('discord-status-text');
    const discordActivity = document.getElementById('discord-activity');

    async function fetchDiscordStatus() {
        try {
            const response = await fetch(lanyardApiUrl);
            const data = await response.json();

            if (data.success) {
                const discordData = data.data;

                // Update Avatar
                if (discordData.discord_user && discordData.discord_user.avatar) {
                    discordAvatar.src = `https://cdn.discordapp.com/avatars/1286107925638676501/${discordData.discord_user.avatar}.png?size=128`;
                } else {
                    discordAvatar.src = 'default-avatar.png'; // รูปภาพ Default หากไม่มี Avatar
                }

                // Update Name
                if (discordData.discord_user && discordData.discord_user.global_name) {
                    discordName.textContent = discordData.discord_user.global_name;
                } else if (discordData.discord_user && discordData.discord_user.username) {
                    discordName.textContent = discordData.discord_user.username;
                } else {
                    discordName.textContent = 'ไม่พบชื่อผู้ใช้';
                }

                // Update Status Text (online, idle, dnd, offline)
                let status = discordData.discord_status || 'offline';
                let statusDisplay = '';
                switch(status) {
                    case 'online': statusDisplay = 'ออนไลน์'; break;
                    case 'idle': statusDisplay = 'ไม่อยู่'; break;
                    case 'dnd': statusDisplay = 'ห้ามรบกวน'; break;
                    case 'offline': statusDisplay = 'ออฟไลน์'; break;
                    default: statusDisplay = 'ไม่ทราบสถานะ';
                }
                discordStatusText.textContent = `สถานะ: ${statusDisplay}`;
                // สามารถเพิ่มการเปลี่ยนสีตามสถานะได้ที่นี่ด้วย

                // Update Activity
                if (discordData.activities && discordData.activities.length > 0) {
                    const currentActivity = discordData.activities[0]; // ดึงกิจกรรมแรก
                    let activityText = '';

                    if (currentActivity.type === 0) { // Playing
                        activityText = `กำลังเล่น: ${currentActivity.name}`;
                    } else if (currentActivity.type === 1) { // Streaming
                        activityText = `กำลังสตรีม: ${currentActivity.name}`;
                    } else if (currentActivity.type === 2) { // Listening
                        activityText = `กำลังฟัง: ${currentActivity.name}`;
                    } else if (currentActivity.type === 3) { // Watching
                        activityText = `กำลังดู: ${currentActivity.name}`;
                    } else if (currentActivity.type === 4) { // Custom Status
                        activityText = `สถานะกำหนดเอง: ${currentActivity.state || 'ไม่มี'}`;
                    } else if (currentActivity.type === 5) { // Competing
                        activityText = `กำลังแข่งขัน: ${currentActivity.name}`;
                    }
                     discordActivity.textContent = `กิจกรรม: ${activityText || 'ไม่มี'}`;
                } else {
                    discordActivity.textContent = 'กิจกรรม: ไม่มี';
                }

            } else {
                console.error('Failed to fetch Discord status:', data.error);
                discordName.textContent = 'เกิดข้อผิดพลาด';
                discordStatusText.textContent = 'สถานะ: ไม่สามารถโหลดได้';
                discordActivity.textContent = 'กิจกรรม: ไม่สามารถโหลดได้';
            }
        } catch (error) {
            console.error('Error fetching Discord status:', error);
            discordName.textContent = 'เกิดข้อผิดพลาด';
            discordStatusText.textContent = 'สถานะ: ไม่สามารถโหลดได้';
            discordActivity.textContent = 'กิจกรรม: ไม่สามารถโหลดได้';
        }
    }

    // เรียกใช้งานฟังก์ชันเมื่อโหลดหน้าเว็บ
    fetchDiscordStatus();
    // สามารถตั้งเวลาให้ Fetch ข้อมูลใหม่ทุกๆ ช่วงเวลา (เช่น 15 วินาที)
    setInterval(fetchDiscordStatus, 15000);
});
