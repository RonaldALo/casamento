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

    if (!data) {
      alert("Nenhuma presença registrada ainda.");
      return;
    }

    // Organiza por grupos A, B, C
    const grupos = { a: [], b: [], c: [] };

    Object.values(data).forEach(p => {
      if (grupos[p.grupo]) {
        grupos[p.grupo].push(p);
      }
    });

    let y = 40;

    const nomesGrupos = { a: "Grupo A", b: "Grupo B", c: "Grupo C" };

    for (const grupoKey of ['a', 'b', 'c']) {
      const lista = grupos[grupoKey];
      if (lista.length > 0) {
        pdf.setFontSize(14);
        pdf.text(`${nomesGrupos[grupoKey]}:`, 20, y);
        y += 10;

        lista.forEach((p, idx) => {
          pdf.setFontSize(12);
          pdf.text(`${idx + 1}. Nome: ${p.nome} | Confirmado: ${p.confirmado === 'sim' ? 'Sim' : 'Não'}`, 25, y);
          y += 8;
        });

        y += 10;
      }
    }

    pdf.save("lista-presenca-gabi-ronald.pdf");
  } catch (err) {
    alert("Erro ao gerar PDF.");
    console.error(err);
  }
});
