/**
 * 新宿GIVERS ウェブサイト用JavaScript
 * 
 * このファイルには以下の機能が含まれています：
 * - ナビゲーションメニュー（ハンバーガーメニュー）の動作
 * - ホームページのカルーセル
 * - スムーススクロール
 * - スポンサープランのタブ切り替え
 */

document.addEventListener('DOMContentLoaded', function() {
    // デバッグ用：読み込み確認
    console.log('DOM fully loaded and parsed');
    
    // ========================================
    // 共通機能: ナビゲーション（ハンバーガーメニュー）
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);
    
    if (hamburger && navMenu) {
      // ハンバーガーメニューのクリックイベント
      hamburger.addEventListener('click', function(event) {
        event.stopPropagation(); // イベントの伝播を停止
        console.log('Hamburger clicked');
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        body.classList.toggle('menu-active');
        
        // モバイルメニュー表示時に背景スクロールを無効化
        if (navMenu.classList.contains('active')) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      });
      
      // メニュー項目をクリックした時にもメニューを閉じる
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          console.log('Nav link clicked');
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
          body.classList.remove('menu-active');
          body.style.overflow = '';
        });
      });
      
      // モバイルメニュー表示中にメニュー外をクリックしたら閉じる
      document.addEventListener('click', function(event) {
        if (!navMenu) return;
        
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        console.log('Document clicked, inside menu:', isClickInsideMenu, 'on hamburger:', isClickOnHamburger);
        
        if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnHamburger) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
          body.classList.remove('menu-active');
          body.style.overflow = '';
        }
      });
    } else {
      console.error('Hamburger menu elements not found');
    }
    
    // ========================================
    // ホームページ: カルーセル
    // ========================================
    const carousel = document.querySelector('.carousel');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carousel && indicators.length > 0) {
      let currentIndex = 0;
      let autoSlideInterval;
      
      // カルーセルの初期状態を設定
      updateCarousel();
      
      // 自動スライド
      startAutoSlide();
      
      // カルーセルにマウスが乗ったら自動スライドを停止
      carousel.addEventListener('mouseenter', stopAutoSlide);
      
      // カルーセルからマウスが離れたら自動スライドを再開
      carousel.addEventListener('mouseleave', startAutoSlide);
      
      // インジケーターのクリックイベント
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
          currentIndex = index;
          updateCarousel();
          resetAutoSlideTimer();
        });
      });
      
      function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 33.333}%)`;
        
        // インジケーターの更新
        indicators.forEach((indicator, index) => {
          if (index === currentIndex) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      }
      
      function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
          currentIndex = (currentIndex + 1) % indicators.length;
          updateCarousel();
        }, 5000);
      }
      
      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }
      
      function resetAutoSlideTimer() {
        stopAutoSlide();
        startAutoSlide();
      }
      
      // スワイプ対応（モバイル向け）
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      }, false);
      
      carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
      }, false);
      
      function handleSwipe() {
        const swipeThreshold = 50; // スワイプと判定する最小距離
        
        if (touchEndX < touchStartX - swipeThreshold) {
          // 左スワイプ（次のスライド）
          currentIndex = Math.min(currentIndex + 1, indicators.length - 1);
          updateCarousel();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          // 右スワイプ（前のスライド）
          currentIndex = Math.max(currentIndex - 1, 0);
          updateCarousel();
        }
      }
    }
    
    // ========================================
    // スムーススクロール
    // ========================================
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // ページ内リンクの場合のみ処理
        if (href.startsWith('#')) {
          e.preventDefault();
          
          const targetId = href === '#' ? 'body' : href;
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // ヘッダーの高さを考慮したスクロール位置調整
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // ========================================
    // スポンサーページ: タブ切り替え
    // ========================================
    const sponsorTabs = document.querySelectorAll('.sponsor-tab');
    const sponsorPlans = document.querySelectorAll('.sponsor-plan-content');
    
    if (sponsorTabs.length > 0 && sponsorPlans.length > 0) {
      sponsorTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
          // タブのアクティブ状態を切り替え
          sponsorTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // コンテンツの表示/非表示を切り替え
          sponsorPlans.forEach(p => p.classList.remove('active'));
          sponsorPlans[index].classList.add('active');
        });
      });
    }
    
    // ========================================
    // フォーム送信処理
    // ========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // 入力検証
        let isValid = true;
        const requiredFields = ['name', 'email', 'message'];
        
        requiredFields.forEach(field => {
          const input = document.getElementById(field);
          
          if (input && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
          } else if (input) {
            input.classList.remove('error');
          }
        });
        
        // メールアドレス形式の検証
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
          }
        }
        
        if (isValid) {
          // 通常はここでAPIにフォームデータを送信
          // この例ではモック機能として成功メッセージを表示
          const formContainer = document.querySelector('.contact-form-container');
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success-message';
          successMessage.innerHTML = '<i class="fas fa-check-circle"></i><h4>送信完了</h4><p>お問い合わせありがとうございます。担当者より折り返しご連絡いたします。</p>';
          
          formContainer.innerHTML = '';
          formContainer.appendChild(successMessage);
        }
      });
    }
  });

  // ========================================
// ページトップに戻るボタン
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    // スクロール時の表示/非表示
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    // クリック時の動作
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});