import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [editable, setEditable] = useState(false);
  const [que, setQue] = useState("");
  const [ans, setAns] = useState("");
  const [cards, setCards] = useState([]);

  //add flashcard function
  const addCard = async () => {
    try {
      const response = await axios.post("http://localhost:8000/addCard", {
        Question: que,
        Answer: ans,
      });
      console.log(response);
      setCards([
        ...[
          {
            Question: que,
            Answer: ans,
          },
        ],
        ...cards,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCard = async (id) => {
    try {
      const deleted = await axios.delete(`http://localhost:8000/delete/${id}`);
      console.log(deleted);
      setCards((prev) =>
        prev.filter((item) => {
          if (item._id === undefined) {
            
            console.log("not okk")
            return false; 
          } else item._id !== id;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const update = () => {
    console.log("okk");
    console.log(que, ans);
    setEditable(!editable);
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getAllCards");
        console.log(setCards(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchCards();
  }, []);

  return (
    <>
      <div className="flex h-screen">
        {/* entry form */}
        <div className="w-1/3 ml-8 border-1 my-6 rounded">
          <h1 className="text-2xl font-bold text-center">Add FlashCard</h1>
          <div>
            <input
              type="text"
              placeholder="Question"
              className="w-[95%] m-2 p-2 bg-white h-6 border"
              onChange={(e) => setQue(e.target.value)}
            />
            <input
              type="text"
              placeholder="Answer"
              className="w-[95%] m-2 p-2 bg-white h-6 border"
              onChange={(e) => setAns(e.target.value)}
            />
          </div>
          <button
            className="w-[95%] m-2 bg-orange-500 h-10 rounded text-white p-2 "
            onClick={addCard}
          >
            Add Flashcard
          </button>
        </div>

        {/* list view */}
        <div className="w-2/3  h-full mr-20">
          <div className="m-5 bg-gray-300 h-[95%] w-[95%] rounded">
            <div className="flex justify-between">
              <div className="m-4 font-bold ">
                <p>Total Card: {cards.length}</p>
                <p>Known:</p>
                <p>Unknown:</p>
              </div>
              <div>
                <button className="bg-amber-900 m-4 rounded-md p-2 text-white">
                  show All card
                </button>
              </div>
            </div>
            {cards.map((items) => {
              return (
                <div className="border-1 p-2 mx-3">
                  {editable ? (
                    <div>
                      <input type="text" className="w-[95%] m-2 bg-white h-6" />
                      <input type="text" className="w-[95%] m-2 bg-white h-6" />
                    </div>
                  ) : (
                    <div>
                      <div className="text-center m-2 h-6">
                        {items.Question}
                      </div>
                      <div className="text-center m-2 h-6">{items.Answer}</div>
                    </div>
                  )}
                  {editable ? (
                    <div className="flex flex-row justify-center">
                      <button
                        className="bg-green-600 px-3 py-1 mx-2 rounded-md text-white"
                        onClick={update}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-600 px-3 py-1 mx-2 rounded-md text-white"
                        onClick={() => setEditable(!editable)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-around">
                      <button
                        className="bg-green-600 px-3 py-1 rounded-md text-white"
                        onClick={() => console.log(!items.known)}
                      >
                        Known
                      </button>

                      <button
                        className="bg-blue-600 px-3 py-1 rounded-md text-white"
                        onClick={() => setEditable(!editable)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 px-3 py-1 rounded-md text-white"
                        onClick={() => deleteCard(items._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
