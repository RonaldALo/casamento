document.getElementById('presence-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const grupo = document.getElementById('grupo').value;
    const confirmado = document.getElementById('confirmado').checked ? 'sim' : 'nao';
  
    if (!nome) return;
  
    const newData = firebase.database().ref("presencas").push();
    newData.set({ nome, grupo, confirmado });
  
    alert("Presença registrada com sucesso!");
    document.getElementById('presence-form').reset();
  });
  
  document.getElementById('download-pdf').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Lista de Presença - Gabi & Ronald", 20, 20);
  
    try {
      const snapshot = await firebase.database().ref("presencas").once("value");
      const data = snapshot.val();
      let y = 40;
      let index = 1;
  
      if (data) {
        Object.entries(data).forEach(([id, p]) => {
          pdf.setFontSize(12);
          pdf.text(`${index++}. Nome: ${p.nome}`, 20, y);
          pdf.text(`   Grupo: ${p.grupo.toUpperCase()} | Confirmado: ${p.confirmado === 'sim' ? 'Sim' : 'Não'}`, 20, y + 7);
          y += 18;
        });
        pdf.save("lista-presenca-gabi-ronald.pdf");
      } else {
        alert("Nenhuma presença registrada ainda.");
      }
    } catch (err) {
      alert("Erro ao gerar PDF.");
      console.error(err);
    }
  });
  