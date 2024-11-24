(function() {
    var bridge = window.vkBridge;
    
    // Инициализация VK Bridge
    bridge.send('VKWebAppInit')
        .then(function() {
            console.log('VK Bridge initialized');
        })
        .catch(function(error) {
            console.log('VK Bridge initialization failed:', error);
        });

    // Методы для работы с рекламой
    window.vkShowInterstitial = function() {
        return bridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
    };

    window.vkShowRewarded = function() {
        return bridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' });
    };

    // Методы для работы с данными
    window.vkStorageSet = function(key, value) {
        return bridge.send('VKWebAppStorageSet', { key: key, value: value });
    };

    window.vkStorageGet = function(key) {
        return bridge.send('VKWebAppStorageGet', { keys: [key] });
    };

    // Методы для работы с пользователем
    window.vkGetUserInfo = function() {
        return bridge.send('VKWebAppGetUserInfo');
    };

    // Методы для работы с платформой
    window.vkGetLaunchParams = function() {
        return bridge.send('VKWebAppGetLaunchParams');
    };

    // Обработка событий от VK Bridge
    bridge.subscribe(function(event) {
        switch(event.detail.type) {
            case 'VKWebAppViewHide':
                console.log('App hidden');
                break;
            case 'VKWebAppViewRestore':
                console.log('App restored');
                break;
            default:
                console.log('VK Bridge event:', event.detail.type);
        }
    });
})();
