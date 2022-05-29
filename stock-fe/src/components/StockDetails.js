import axios from 'axios';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../utils/config';

const StockDetails = () => {
  const [data, setData] = useState([]);

  // 目前在第幾頁
  const [page, setPage] = useState(1);

  // 總筆數 1,2,3,4,5,6,...,12
  const[lastPage, setLastPage] = useState(1);

  // 從網址上把 :stockId 拿下來
  const { stockId } = useParams();

  // 當 useEffect 的第二個參數是空陣列的時候
  // 表示這是元件載入時的「副作用」
  useEffect(() => {
    let getPrices = async () => {
      // http://localhost:3001/stocks/2330?page=1
      let response = await axios.get(`${API_URL}/stocks/${stockId}`,{
        params: {
          page: page,
        }
      });
      // 根據 page 取得 後端 API 的資料
      setData(response.data.data);
      // setXXX 是一個非同步函式
      setLastPage(response.data.pagination.lastPage);
    }
    getPrices();
  },[page]);
  // 初始化的時候, page 會從沒有定義變成預設值

  const getPages = () => {
    let pages = [];
    for(let i = 1; i <= lastPage; i++) {
      // page 是我們現在在第幾頁
      pages.push(
        <li
          style={{
            display: 'inline-block',
            margin: '2px',
            backgroundColor: page === i ? '#00d1b2' : '',
            borderColor: page === i ? '#00d1b2' : '#dbdbdb',
            color: page === i ? '#fff' : '#363636',
            borderWidth: '1px',
            width: '28px',
            height: '28px',
            borderRadius: '3px',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          key={i}
          /* 管理好 page 這個狀態 */
          onClick={() => setPage(i)}
        >
        {i}
        </li>
      );
    }
    return pages;
  };

  return (
    <div>
      <ul>{getPages()}</ul>
      {
        data.map((item) => {
          return (
            <div key={item.date} className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">日期： {item.date}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">成交金額： {item.amount}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">成交股數： {item.volume}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">開盤價： {item.open_price}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">收盤價： {item.close_price}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">漲跌價差： {item.delta_price}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">最高價： {item.high_price}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">最低價： {item.low_price}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">成交筆數： {item.transactions}</h2>
            </div>
          );
        })
      }
    </div>
  );
};

export default StockDetails;
