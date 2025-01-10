import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Alerts.css"; // Import the CSS file

const Alerts = () => {
  const [medications, setMedications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [services, setServices] = useState({}); // To store service names by ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch medications data
        const response = await fetch("http://localhost:5000/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("API Response:", data);

        setMedications(data.medications || []);
        setOrders(data.incompleteOrders || []);
        setRequests(data.requests || []);

        // Fetch services data (this is just an example URL)
        const serviceResponse = await fetch("http://localhost:5000/api/services/all");
        if (!serviceResponse.ok) {
          throw new Error("Failed to fetch services");
        }
        const serviceData = await serviceResponse.json();

        // Create a mapping of serviceID to serviceName
        const serviceMap = serviceData.reduce((acc, service) => {
          acc[service.servicoID] = service.nomeServico; // Assuming servicoID and nomeServico exist
          return acc;
        }, {});

        setServices(serviceMap);
      } catch (error) {
        setError("Failed to load data");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="alerts-page">
      <Toolbar name="Alerts" />
      <div className="alerts-content">
        {error && <p className="error-message">{error}</p>}

        {/* Medications Section */}
        <section className="alerts-section">
          <h2>Medicamentos Em Falta</h2>
          {medications.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column">Medicamento</div>
                <div className="column">Serviço Hospitalar</div>
                <div className="column">Descricao</div>
                <div className="column">Disponivel</div>
                <div className="column">Minimo</div>
              </div>
              {medications.map((medication) => (
                <div className="alerts-table-row" key={medication.medicamentoID}>
                  <div className="column">{medication.nomeMedicamento}</div>
                  <div className="column">{services[medication.servicoID]}</div>
                  <div className="column">{medication.tipoMedicamento}</div>
                  <div className="column">{medication.quantidadeDisponivel}</div>
                  <div className="column">{medication.quantidadeMinima}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No medications available at the moment.</p>
          )}
        </section>

        {/* Orders Section */}
        <section className="alerts-section">
          <h2>Encomendas Pendentes</h2>
          {orders.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column">Encomenda N.º</div>
                <div className="column">Completa?</div>
                <div className="column">Data de Encomenda</div>
              </div>
              {orders.map((order) => (
                <div className="alerts-table-row" key={order.encomendaID}>
                  <div className="column">{order.encomendaID}</div>
                  <div className="column">{order.encomendaCompleta ? "Completa" : "Pendente"}</div>
                  <div className="column">{new Date(order.dataEncomenda).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No incomplete orders available at the moment.</p>
          )}
        </section>

        {/* Requests Section */}
        <section className="alerts-section">
          <h2>Requisições Pendentes</h2>
          {requests.length > 0 ? (
            <div className="alerts-table-container-request">
              <div className="alerts-table-header-request">
                <div className="column">Requisição N.º</div>
                <div className="column">Nome</div>
                <div className="column">Data de Pedido</div>
                <div className="column">Aprovado?</div>
              </div>
              {requests.map((request) => (
                <div className="alerts-table-row-request" key={request.requisicaoID}>
                  <div className="column">{request.requisicaoID}</div>
                  <div className="column">{`${request.nomeProprio} ${request.ultimoNome}`}</div>
                  <div className="column">
                    {new Date(request.dataRequisicao).toLocaleDateString()}
                  </div>
                  <div className="column">
                    {request.aprovadoPorAdministrador ? "Aprovado" : "Pendente"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No requests available at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Alerts;