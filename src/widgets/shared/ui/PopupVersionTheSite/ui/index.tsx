
import { FC,  useState } from "react";

interface PopupVersionTheSiteProps {
    
}

export const PopupVersionTheSite: FC<PopupVersionTheSiteProps> = () => {
    const [isVisible, setIsVisible] = useState(true);

    

    const handleClose = () => {
      setIsVisible(false);
       // Обновляем текущий commit hash
      window.location.reload(); // Перезагрузка страницы для применения новой версии
    };
    return (
        isVisible && (<div 
            className="   bg-gray-800 text-white p-4 rounded-lg shadow-lg w-40 z-50"
            style={{
                position: 'fixed', // фиксируем позицию элемента
                bottom: '20px', // отступ сверху
                right: '20px', // отступ справа
            }}
        >
            <h2 className="text-lg font-bold mb-2">Устаревшая версия сайта</h2>
            <p className="mb-3">
                Вы используете устаревшую версию сайта. 
            </p>
            <button 
                onClick={handleClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
                Понятно
            </button>
        </div>
    ));
};

    