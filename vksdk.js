function vkBridgeInit() {
    // Проверяем, что VK Bridge готов к использованию
    if (!window.vkBridgeReady) {
        console.error('VK Bridge is not ready');
        return;
    }

    // Показ рекламы
    window.showVKAd = function() {
        vkShowInterstitial()
            .then(data => {
                console.log('Interstitial ad shown:', data);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdCompleted');
                }
            })
            .catch(error => {
                console.error('Interstitial ad error:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.toString());
                }
            });
    };

    window.showVKRewardedAd = function() {
        vkShowRewarded()
            .then(data => {
                console.log('Rewarded ad shown:', data);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnRewardedAdCompleted');
                }
            })
            .catch(error => {
                console.error('Rewarded ad error:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.toString());
                }
            });
    };

    // Сохранение данных
    window.vkSaveData = function(key, value) {
        if (!key || !value) {
            console.error('Invalid save data parameters:', { key, value });
            return;
        }

        vkStorageSet(key, value)
            .then(response => {
                console.log('Data saved:', { key, value });
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveComplete', key);
                }
            })
            .catch(error => {
                console.error('Save data error:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveError', error.toString());
                }
            });
    };

    // Загрузка данных
    window.vkLoadData = function(key) {
        if (!key) {
            console.error('Invalid load data parameter:', key);
            return;
        }

        vkStorageGet(key)
            .then(data => {
                console.log('Data loaded:', data);
                if (window.unityInstance) {
                    const value = data.keys[0].value || '';
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadComplete', JSON.stringify({
                        key: key,
                        value: value
                    }));
                }
            })
            .catch(error => {
                console.error('Load data error:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadError', error.toString());
                }
            });
    };

    // Получение информации о пользователе
    vkBridge.send('VKWebAppGetUserInfo')
        .then(data => {
            console.log('User data:', data);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnUserDataReceived', JSON.stringify(data));
            }
        })
        .catch(error => {
            console.error('Get user info error:', error);
        });

    // Уведомляем Unity о готовности SDK
    if (window.unityInstance) {
        window.unityInstance.SendMessage('PlatformSDKManager', 'OnVKSDKInitialized');
    }

    console.log('VK SDK initialized');
}

// Добавляем обработку ошибок
window.onerror = function(msg, url, line, col, error) {
    console.error('JavaScript error:', { msg, url, line, col, error });
    if (window.unityInstance) {
        window.unityInstance.SendMessage('PlatformSDKManager', 'OnJavaScriptError', JSON.stringify({
            message: msg,
            url: url,
            line: line,
            column: col,
            error: error ? error.toString() : ''
        }));
    }
    return false;
};
