import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [editable, setEditable] = useState(false);
  const [que, setQue] = useState("");
  const [ans, setAns] = useState("");
  const [cards, setCards] = useState([]);

  const BASE_URL = "http://localhost:8000";

  const totalCards = cards.length;
  const known = cards.filter((c) => (c.known ? true : false)).length;
  const unknown = totalCards - known;

  //-------------------------add flashcard function------------------------------------------
  const addCard = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/addCard`, {
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
  //-------------------delete card API call ------------------------------------------------
  const deleteCard = async (id) => {
    try {
      const deleted = await axios.delete(`${BASE_URL}/delete/${id}`);
      console.log(deleted);
      setCards((prev) =>
        prev.filter((item) => {
          if (item._id === undefined) {
            console.log("not okk");
            return false;
          } else item._id !== id;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  //----------------------------update card--------------------------------------------------------
  const update = async (Question, Answer, id) => {
    console.log("okk");
    console.log(que, ans);
    const edited = { Question, Answer };
    try {
      const res = await axios.put(`${BASE_URL}/update/${id}`, edited);
      console.log(res.data.updated);
      const updated = res.data.updated;
      setCards(
        cards.map((card) =>
          updated._id === id
            ? { ...card, Answer: updated.Answer, Question: updated.Question }
            : card
        )
      );
    } catch (err) {
      console.log(err);
    }

    setEditable(null);
  };

  //---------update Known-------------------------------------------------
  const updateKnown = async (id, known) => {
    try {
      const response = await axios.put(`${BASE_URL}/updateKnown/${id}`, {
        known: known,
      });
      console.log(response.data.updated.known);
      setCards(
        cards.map((card) =>
          card._id === id ? { ...card, known: !known } : card
        )
      );
    } catch (err) {
      console.log(err);
    }
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
        {/*---------------------- entry form ----------------------------------------*/}
        <div className="w-1/3 ml-8 my-6 rounded shadow-gray-700 shadow p-6">
          <h1 className="text-2xl font-bold text-center">Add FlashCard</h1>
          <div>
            <input
              type="text"
              placeholder="Question"
              className="w-full m-2 p-2 bg-white border-gray-300 rounded border"
              onChange={(e) => setQue(e.target.value)}
            />
            <input
              type="text"
              placeholder="Answer"
              className="w-full m-2 p-2 bg-white border-gray-300 border rounded"
              onChange={(e) => setAns(e.target.value)}
            />
          </div>
          <button
            className="w-[95%] m-2 bg-red-500 h-10 rounded text-white p-2 "
            onClick={addCard}
          >
            Add Flashcard
          </button>
        </div>

        {/*-------------------------------list view ----------------------------------------*/}
        <div className="w-2/3  h-full mr-20">
          <div className="m-5 bg-gray-100 h-[95%] w-[95%] rounded">
            <div className="flex justify-between">
              <div className="m-4 font-bold ">
                <p>Total Card: {totalCards}</p>
                <p>Known:{known}</p>
                <p>Unknown:{unknown}</p>
              </div>
              <div>
                <button className="bg-amber-900 m-4 rounded-md p-2 text-white">
                  show All card
                </button>
              </div>
            </div>
            {cards.map((items) => {
              return (
                <div className="border-gray-400 border p-4 m-3 rounded-2xl shadow-xl">
                  {items._id === editable ? (
                    <div>
                      <input
                        defaultValue={items.Question}
                        type="text"
                        className="w-[95%] m-2 bg-white p-1  "
                        onChange={(e) => setQue(e.target.value)}
                      />
                      <input
                        defaultValue={items.Answer}
                        type="text"
                        className="w-[95%] m-2 bg-white p-1"
                        onChange={(e) => setAns(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-center m-2 h-6">
                        {items.Question}
                      </div>
                      <div className="text-center m-2 h-6">{items.Answer}</div>
                    </div>
                  )}
                  {items._id === editable ? (
                    <div className="flex flex-row justify-center">
                      <button
                        className="bg-green-600 px-3 py-1 mx-2 rounded-md text-white"
                        onClick={(e) => update(que, ans, items._id)}
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
                        className="bg-blue-600 px-3 py-1 rounded-md text-white"
                        onClick={() => setEditable(items._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-green-600 px-3 py-1 rounded-md text-white"
                        onClick={() => updateKnown(items._id, items.known)}
                      >
                        {items.known ? "Mark as unKnown" : "mark as known"}
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
