(function() {
    // Проверяем доступность VK Bridge
    if (typeof vkBridge === 'undefined') {
        console.error('VK Bridge is not loaded');
        return;
    }

    // Инициализация VK Bridge
    try {
        vkBridge.send('VKWebAppInit')
            .then(function(data) {
                if (data.result) {
                    console.log('VK Bridge initialization succeeded');
                    // Получаем информацию о пользователе
                    return vkBridge.send('VKWebAppGetUserInfo');
                } else {
                    console.warn('VK Bridge initialization failed');
                }
            })
            .then(function(data) {
                console.log('User data received:', data);
            })
            .catch(function(error) {
                console.error('VK Bridge error:', error);
            });
    } catch (error) {
        console.error('VK Bridge initialization error:', error);
    }

    // Методы для работы с рекламой
    window.vkShowInterstitial = function() {
        return vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
            .catch(function(error) {
                console.error('Show interstitial ad error:', error);
                return Promise.reject(error);
            });
    };

    window.vkShowRewarded = function() {
        return vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' })
            .catch(function(error) {
                console.error('Show rewarded ad error:', error);
                return Promise.reject(error);
            });
    };

    // Методы для работы с данными
    window.vkStorageSet = function(key, value) {
        return vkBridge.send('VKWebAppStorageSet', { key: key, value: String(value) })
            .catch(function(error) {
                console.error('Storage set error:', error);
                return Promise.reject(error);
            });
    };

    window.vkStorageGet = function(key) {
        return vkBridge.send('VKWebAppStorageGet', { keys: [key] })
            .catch(function(error) {
                console.error('Storage get error:', error);
                return Promise.reject(error);
            });
    };

    // Подписываемся на события VK Bridge
    vkBridge.subscribe(function(event) {
        console.log('VK Bridge event:', event);
        switch(event.detail.type) {
            case 'VKWebAppViewHide':
                // Игра свернута
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnApplicationPause', 'true');
                }
                break;
            case 'VKWebAppViewRestore':
                // Игра развернута
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnApplicationPause', 'false');
                }
                break;
        }
    });

    // Сообщаем о готовности VK Bridge
    window.vkBridgeReady = true;
    console.log('VK Bridge methods initialized');
})();
