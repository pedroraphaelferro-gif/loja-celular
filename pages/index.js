import { useState, useEffect } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dividas, setDividas] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dados"));
    if (data) {
      setProdutos(data.produtos || []);
      setDividas(data.dividas || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dados", JSON.stringify({ produtos, dividas }));
  }, [produtos, dividas]);

  function addProduto() {
    if (!nome) return;
    setProdutos([...produtos, { id: Date.now(), nome, preco, estoque }]);
    setNome("");
    setPreco("");
    setEstoque("");
  }

  function vender(p) {
    if (p.estoque <= 0) return alert("Sem estoque");

    setProdutos(produtos.map(x =>
      x.id === p.id ? { ...x, estoque: x.estoque - 1 } : x
    ));

    if (cliente) {
      setDividas([
        ...dividas,
        {
          id: Date.now(),
          cliente,
          telefone,
          valor: p.preco
        }
      ]);
    }
  }

  function cobrar(d) {
    const msg = `Olá ${d.cliente}, você deve R$ ${d.valor}`;
    window.open(`https://wa.me/55${d.telefone}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📱 Sistema Loja Celular</h1>

      <h2>Produtos</h2>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
      <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />
      <button onClick={addProduto}>Adicionar</button>

      {produtos.map(p => (
        <div key={p.id}>
          {p.nome} - R$ {p.preco} - Estoque: {p.estoque}
          <button onClick={() => vender(p)}>Vender</button>
        </div>
      ))}

      <h2>Venda Fiado</h2>
      <input placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} />
      <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

      <h2>Clientes Devendo</h2>
      {dividas.map(d => (
        <div key={d.id}>
          {d.cliente} - R$ {d.valor}
          <button onClick={() => cobrar(d)}>Cobrar WhatsApp</button>
        </div>
      ))}
    </div>
  );
}
