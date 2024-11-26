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
            SendMessage('VKPlatformSDK', 'JSOnUserDataReceived', JSON.stringify(data));
            // После получения данных пользователя пробуем загрузить сохранения
            console.log('Attempting to load saved data...');
            window.vkLoadData('SavedGameData');
        })
        .catch(function(error) {
            console.error('VK Bridge error:', error);
        });

    // Методы для работы с рекламой
    window.showVKAd = function() {
        vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'interstitial'
        }).then(function(data) {
            console.log('Interstitial ad shown:', data);
            SendMessage('VKPlatformSDK', 'JSOnAdCompleted');
        }).catch(function(error) {
            console.error('Show interstitial ad error:', error);
            SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
        });
    };

    window.showVKRewardedAd = function() {
        vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'reward'
        }).then(function(data) {
            console.log('Rewarded ad shown:', data);
            SendMessage('VKPlatformSDK', 'JSOnRewardedAdCompleted');
        }).catch(function(error) {
            console.error('Show rewarded ad error:', error);
            SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
        });
    };

    // Методы для работы с данными
    window.vkSaveData = function(key, value) {
        console.log('Saving data:', { key, value });
        vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        }).then(function(data) {
            console.log('Data saved successfully:', { key, value });
            SendMessage('VKPlatformSDK', 'JSOnSaveComplete', key);
        }).catch(function(error) {
            console.error('Save data error:', error);
            SendMessage('VKPlatformSDK', 'JSOnSaveError', error.toString());
        });
    };

    window.vkLoadData = function(key) {
        console.log('Loading data for key:', key);
        vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        }).then(function(data) {
            console.log('Data loaded:', data);
            // Всегда вызываем JSOnLoadComplete с данными или пустой строкой
            var value = '';
            if (data && data.keys && data.keys.length > 0) {
                value = data.keys[0].value || '';
            }
            SendMessage('VKPlatformSDK', 'JSOnLoadComplete', value);
        }).catch(function(error) {
            console.error('Load data error:', error);
            // При ошибке тоже вызываем JSOnLoadComplete с пустой строкой
            SendMessage('VKPlatformSDK', 'JSOnLoadComplete', '');
        });
    };

    // Сообщаем о готовности VK Bridge
    console.log('VK Bridge methods initialized');
})();
