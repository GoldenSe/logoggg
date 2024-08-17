// tonconnect.js

document.addEventListener("DOMContentLoaded", function() {
  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://<ВАШ_АДРЕС_ПРИЛОЖЕНИЯ>/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
  });

  async function connectToWallet() {
    try {
      const wallet = await tonConnectUI.connectWallet();
      console.log("Кошелек подключен:", wallet);

      // Отправляем адрес кошелька в Unity
      if (wallet && wallet.address) {
        if (typeof window.SendMessageToUnity === 'function') {
          window.SendMessageToUnity(wallet.address);
        }
      }
    } catch (error) {
      console.error("Ошибка при подключении к кошельку:", error);
    }
  }

  // Автоматическая попытка подключения при загрузке страницы
  connectToWallet();
});
