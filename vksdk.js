function vkBridgeInit() {
    // Показ рекламы
    window.showVKAd = function() {
        vkShowInterstitial()
            .then(data => {
                console.log('Реклама показана:', data);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdCompleted');
                }
            })
            .catch(error => {
                console.log('Ошибка показа рекламы:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.message);
                }
            });
    };

    window.showVKRewardedAd = function() {
        vkShowRewarded()
            .then(data => {
                console.log('Награда получена:', data);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnRewardedAdCompleted');
                }
            })
            .catch(error => {
                console.log('Ошибка показа рекламы с наградой:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnAdError', error.message);
                }
            });
    };

    // Сохранение данных
    window.vkSaveData = function(key, value) {
        vkStorageSet(key, value)
            .then(response => {
                console.log('Данные сохранены:', response);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveComplete', key);
                }
            })
            .catch(error => {
                console.log('Ошибка сохранения:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnSaveError', error.message);
                }
            });
    };

    // Загрузка данных
    window.vkLoadData = function(key) {
        vkStorageGet(key)
            .then(data => {
                console.log('Данные загружены:', data);
                if (window.unityInstance) {
                    const value = data.keys[0].value || '';
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadComplete', JSON.stringify({
                        key: key,
                        value: value
                    }));
                }
            })
            .catch(error => {
                console.log('Ошибка загрузки:', error);
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('PlatformSDKManager', 'OnLoadError', error.message);
                }
            });
    };

    // Получение информации о пользователе при инициализации
    vkGetUserInfo()
        .then(data => {
            console.log('User data:', data);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnUserDataReceived', JSON.stringify(data));
            }
        })
        .catch(error => console.log(error));

    // Получение параметров запуска
    vkGetLaunchParams()
        .then(data => {
            console.log('Launch params:', data);
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlatformSDKManager', 'OnLaunchParamsReceived', JSON.stringify(data));
            }
        })
        .catch(error => console.log(error));

    // Уведомляем Unity о готовности SDK
    if (window.unityInstance) {
        window.unityInstance.SendMessage('PlatformSDKManager', 'OnVKSDKInitialized');
    }
}
