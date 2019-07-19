import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
const formAPI = 'http://localhost:1337/tarefas/';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      act: 0,
      index: '', 
      title: "Lista de tarefas",
      datas: []
    }
  }
  async componentDidMount(){
    this.refs.nome.focus();
    this.listar();
  }
  async listar(){
    const {data: datas} = await axios.get(formAPI);
    return this.setState({datas});
  }

  cadastrar = (event) => {
    event.preventDefault();
    const obj = {
      nome: this.refs.nome.value,
      horaCriacaoTarefa: this.refs.horaCriacaoTarefa.value,
      horaEntregaTarefa: this.refs.horaEntregaTarefa.value,
      descricao: this.refs.descricao.value
    };
    if(this.state.act === 0){
      axios.post(formAPI, obj);
    }else{
      axios.put(formAPI + this.state.index, obj)
    }
    this.setState({
      act: 0
    });
    this.refs.formTarefas.reset();
    this.refs.nome.focus();
    this.listar(); //Como resolver sem chamar duas vezes o listar?
    this.listar();  
  }

  remover = (event, tarefas) => {
    event.preventDefault();
    axios.delete(formAPI + tarefas);
    this.refs.formTarefas.reset();
    this.listar(); //Como resolver sem chamar duas vezes o listar?
    this.listar();
  }

  editar = (event, tarefa,  i) => {
    event.preventDefault();
    let data = this.state.datas[i];
    this.refs.nome.value = data.nome;
    this.refs.horaCriacaoTarefa.value = data.horaCriacaoTarefa;
    this.refs.horaEntregaTarefa.value = data.horaEntregaTarefa;
    this.refs.descricao.value = data.descricao;

    this.setState({
      act:1,
      index: tarefa
    });
    
    this.refs.nome.focus();
  }

  dateFormat(date){
    let format = date.replace(/T/, " ").split(" ");
    let d = format[0].split("-").reverse().join("-");
    d += " " + format[1];
    return d;
  }

  render(){
    let datas = this.state.datas;
    return (
      <div className="App">
        <h2 className="title">
          {this.state.title}
        </h2>
        <div className="jumbotron ligth-g sombra">
          <div className="Container">
            <form ref="formTarefas" className="form-group">
              <div className="row">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text ligth-b" id="basic-addon1">Nome</span>
                  </div>
                  <input required="required" type="text" className="form-control" name="nome" ref="nome" placeholder="Insira o Nome da tarefa" aria-label="nome" aria-describedby="basic-addon1" />
                </div>
              </div>

              <div className="row">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text ligth-b" id="basic-addon1">Data da criação e da entrega</span>
                  </div>
                  <input required="required" type="DateTime-Local" className="form-control" name="horaCriacaoTarefa" ref="horaCriacaoTarefa" aria-label="horaCriacao" aria-describedby="basic-addon1" />
                  <input required="required" type="DateTime-Local" className="form-control" name="horaIntregaTarefa" ref="horaEntregaTarefa" aria-label="horaEntrega" aria-describedby="basic-addon1" />
                </div>
              </div>
              <div className="row">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text ligth-b" id="basic-addon1">Descrição</span>
                  </div>
                  <textarea required="required" className="form-control" name="descricao" ref="descricao" placeholder="Descreva a tarefa que ira ser realizada" aria-label="descricao" aria-describedby="basic-addon1" />
                </div>
              </div>
              <div className="row justify-content-md-center">
                  <div className="center">
                    <button type="button" className="btn btn-estagia" onClick={(e)=>this.cadastrar(e)}>Adicionar</button>
                  </div>
                </div>
            </form>    
            <pre>
              {datas.map((data, i) =>
              <ul className="list-group">
                <li key={i} className="list-group-item col-sm">
                  <h4><span className="badge badge-secondary color-red col-sm">Tarefa: {i + 1} Nome: {data.nome}</span></h4>
                  <h5>Data e hora da criação: {this.dateFormat(data.horaCriacaoTarefa)}</h5> 
                </li>

                <li className="list-group-item col-sm">
                  <h5>Data e hora da entrega: {this.dateFormat(data.horaEntregaTarefa)}</h5> 
                </li>

                <li className="list-group-item col-sm">
                  <h5>Descrição: {data.descricao}</h5> 
                </li>
                <li className="list-group-item col-sm text-center">
                  <button type="button" className="btn btn-danger-list" onClick={(e)=>this.remover(e, data.id)}>Remover</button>
                  <button type="button" className="btn btn-list" onClick={(e)=>this.editar(e, data.id, i)}>Editar</button>
                </li>
              </ul>
              )}
            </pre>
          </div> 
        </div>
      </div>
    );
  }
}

export default App;
