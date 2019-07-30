import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { Button, Jumbotron, Card, Accordion, Container, ListGroup, Form, Navbar, Nav, FormControl, Col } from 'react-bootstrap';
const formAPI = 'https://crudformapi.herokuapp.com/tarefas/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      act: 0,
      index: '',
      datas: []
    }
  }
  async componentDidMount() {
    this.refs.nome.focus();
    this.listar(1);
  }
  async listar(n) {
    const { data: datas } = await axios.get(formAPI);
    if (n === 1) {
      return this.setState({ datas });
    } else {
      n++;
      return this.listar(n);
    }
  }

  cadastrar = (event) => {
    event.preventDefault();
    const obj = {
      nome: this.refs.nome.value,
      horaCriacaoTarefa: this.refs.horaCriacaoTarefa.value,
      horaEntregaTarefa: this.refs.horaEntregaTarefa.value,
      descricao: this.refs.descricao.value
    };

    if (obj.nome === "" || obj.horaCriacaoTarefa === "" || obj.horaEntregaTarefa === "" || obj.descricao === "") {
      alert("Campo(s) não preenchidos!");
    } else {
      if (this.state.act === 0) {
        axios.post(formAPI, obj);
      } else {
        axios.put(formAPI + this.state.index, obj);
      }
      this.setState({
        act: 0
      });

      this.refs.formTarefas.reset();
      this.refs.nome.focus();
      this.listar(0);
    }
  }

  remover = (event, tarefas) => {
    event.preventDefault();
    axios.delete(formAPI + tarefas);
    this.refs.formTarefas.reset();
    this.listar(0);
  }

  editar = (event, tarefa, i) => {
    event.preventDefault();
    let data = this.state.datas[i];
    this.refs.nome.value = data.nome;
    this.refs.horaCriacaoTarefa.value = data.horaCriacaoTarefa;
    this.refs.horaEntregaTarefa.value = data.horaEntregaTarefa;
    this.refs.descricao.value = data.descricao;

    this.setState({
      act: 1,
      index: tarefa
    });

    this.refs.nome.focus();
  }

  dateFormat(date) {
    let format = date.replace(/T/, " ").split(" ");
    let d = format[0].split("-").reverse().join("-");
    d += " " + format[1];
    return d;
  }

  render() {
    let datas = this.state.datas;
    return (
      <Container className="App">

        <Jumbotron className="ligth-g shadow bordaJumbotron">
          <Navbar bgh="ligth" expand="lg" className="navBar shadow">
            <Navbar.Brand><h2>Lista de alunos</h2></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="#cadastrarAluno" className="navlink"><p id="linkCadastro">Cadastrar novo aluno</p></Nav.Link>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Buscar aluno" className="mr-sm-2" />
                <Button variant="outline-success"><p>Pesquisar</p></Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>

          <Container>
            <Form ref="formTarefas">
              <Form.Group controlId="nomeAlunos">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="nome" ref="nome" placeholder="Nome da tarefa" required="required"></Form.Control>
              </Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>Data da criação da tarefa</Form.Label>
                  <Form.Control type="DateTime-Local" name="horaCriacaoTarefa" ref="horaCriacaoTarefa" required="required"></Form.Control>
                </Col>
                <Col>
                  <Form.Label>Data da entrega da tarefa</Form.Label>
                  <Form.Control type="DateTime-Local" name="horaIntregaTarefa" ref="horaEntregaTarefa" required="required"></Form.Control>
                </Col>
              </Form.Row>
              <Form.Group>
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows="3" ref="descricao" placeholder="Descrição da tarefa" required="required"></Form.Control>
              </Form.Group>
              <Container className="text-center">
                <Button variant="btn btn-estagia" onClick={(e) => this.cadastrar(e)}>Adicionar</ Button>
              </Container>
            </Form>
          </Container>

          <Jumbotron className="jumbo">
            <pre>
              {datas.map((data, i) =>
                <ListGroup key={i}>
                  <ListGroup.Item className="itemLista">
                    <Accordion defaultActiveKey="1">
                      <Card>
                        <Card.Header className="card">
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4><span className="badge badge-secondary col-sm span">Tarefa: {i + 1} Nome: {data.nome}</span></h4>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>

                            <ListGroup.Item>
                              <h5>{`Data e hora da criação: ${this.dateFormat(data.horaCriacaoTarefa)}`}</h5>
                            </ListGroup.Item>

                            <ListGroup.Item>
                              <h5>{`Data e hora da entrega: ${this.dateFormat(data.horaEntregaTarefa)}`}</h5>
                            </ListGroup.Item>

                            <ListGroup.Item className="text-descricao">
                              <h5>{`Descrição:${data.descricao}`}</h5>
                            </ListGroup.Item>

                            <Container className="list-group-item text-center">
                              <Button id="btnRemover" variant="btn btn-danger-list" onClick={(e) => this.remover(e, data.id)}>Remover</ Button>
                              <Button variant="btn btn-list" onClick={(e) => this.editar(e, data.id, i)}>Editar</ Button>
                            </Container>

                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </pre>
          </Jumbotron>
        </Jumbotron>
      </Container>
    );
  }
}
export default App;
