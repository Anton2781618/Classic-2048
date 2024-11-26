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
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnUserDataReceived', JSON.stringify(data));
                // После получения данных пользователя пробуем загрузить сохранения
                console.log('Attempting to load saved data...');
                window.vkLoadData('SavedGameData');
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
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnAdCompleted');
            }
        }).catch(function(error) {
            console.error('Show interstitial ad error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
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
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnRewardedAdCompleted');
            }
        }).catch(function(error) {
            console.error('Show rewarded ad error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
            }
        });
    };

    // Методы для работы с данными
    window.vkSaveData = function(key, value) {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('VK SDK not initialized');
            return;
        }
        console.log('Saving data:', { key, value });
        return vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        }).then(function(data) {
            console.log('Data saved successfully:', { key, value });
            if (window.unityInstance) {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnSaveComplete', key);
            }
        }).catch(function(error) {
            console.error('Save data error:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnSaveError', error.toString());
            }
        });
    };

    window.vkLoadData = function(key) {
        if (!window.environmentData || !window.environmentData.initialized) {
            console.error('!!!VK SDK не инициализирован!');
            return;
        }
        console.log('Loading data for key:', key);
        return vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        }).then(function(data) {
            console.log('!!!Данные загруженны:', data);
            if (window.unityInstance) {
                const value = data.keys[0].value || '';
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadComplete', value);
            }
        }).catch(function(error) {
            console.error('!!!Ошибка при загрузке данных:', error);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadError', error.toString());
            }
        });
    };

    // Сообщаем о готовности VK Bridge
    console.log('!!!Методы VK Bridge проинициализированы!');
})();
