import logo from './logo.svg';
import './App.css';
import {gql, useQuery} from '@apollo/client'

const query = gql`
query GetAllTodos {
  getTodos {
    title,
    completed,
    user{
      name
    }
  }
}`
function App() {
  const {loading, error, data} = useQuery(query)
  if(loading) return <p>Loading...</p>
  return <div className="App">
    <table>
      {
        data.getTodos.map(todo => {
          return <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.completed}</td>
            <td>{todo.user.name}</td>
          </tr>
        })
      }
    </table>

  </div>
}

export default App;
