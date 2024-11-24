(function() {
    // Проверяем доступность VK Bridge
    if (typeof vkBridge === 'undefined') {
        console.error('VK Bridge is not loaded');
        return;
    }

    // Инициализация VK Bridge
    vkBridge.send('VKWebAppInit')
        .then(function() {
            console.log('VK Bridge initialized');
            // После успешной инициализации получаем данные пользователя
            return vkBridge.send('VKWebAppGetUserInfo');
        })
        .then(function(data) {
            console.log('User data received:', data);
            if (window.environmentData) {
                window.environmentData.userInfo = data;
            }
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnUserDataReceived', JSON.stringify(data));
            }
        })
        .catch(function(error) {
            console.error('VK Bridge error:', error);
        });

    // Методы для работы с рекламой
    window.vkShowInterstitial = function() {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('VK SDK not initialized');
            return;
        }
        return vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'interstitial'
        }).then(function(data) {
            console.log('Interstitial ad shown:', data);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdCompleted');
            }
        }).catch(function(error) {
            console.error('Show interstitial ad error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.toString());
            }
        });
    };

    window.vkShowRewarded = function() {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('VK SDK not initialized');
            return;
        }
        return vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'reward'
        }).then(function(data) {
            console.log('Rewarded ad shown:', data);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnRewardedAdCompleted');
            }
        }).catch(function(error) {
            console.error('Show rewarded ad error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.toString());
            }
        });
    };

    // Методы для работы с данными
    window.vkSaveData = function(key, value) {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('VK SDK not initialized');
            return;
        }
        return vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        }).then(function(data) {
            console.log('Data saved:', { key, value });
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveComplete', key);
            }
        }).catch(function(error) {
            console.error('Save data error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveError', error.toString());
            }
        });
    };

    window.vkLoadData = function(key) {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('!!!VK SDK не инициализирован!');
            return;
        }
        return vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        }).then(function(data) {
            console.log('!!!Данные загруженны:', data);
            if (window.unityInstance) {
                const value = data.keys[0].value || '';
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadComplete', JSON.stringify({
                    key: key,
                    value: value
                }));
            }
        }).catch(function(error) {
            console.error('!!!Ошибка при загрузке данных:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadError', error.toString());
            }
        });
    };

    // Подписываемся на события VK Bridge
    vkBridge.subscribe(function(event) {
        console.log('!!!VK Bridge событие:', event);
        if (window.unityInstance) {
            switch(event.detail.type) {
                case 'VKWebAppViewHide':
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnApplicationPause', 'true');
                    break;
                case 'VKWebAppViewRestore':
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnApplicationPause', 'false');
                    break;
            }
        }
    });

    // Сообщаем о готовности VK Bridge
    console.log('!!!Методы VK Bridge проинициализированы!');
})();
