const { SQLDataSource } = require("datasource-sql");
const DataLoader = require("dataloader");

class MatriculasAPI extends SQLDataSource {
  constructor(dbConfig) {
    super(dbConfig);
    this.Resposta = {
      mensagem: "",
    };
  }

  async matricularEstudante(ids) {
    const novaMatricula = {
      estudante_id: ids.estudante,
      turma_id: ids.turma,
      status: "confirmado",
    };

    await this.db.insert(novaMatricula).into("matriculas");

    this.Resposta.mensagem = "Matrícula confirmada!";

    return this.Resposta;
  }

  async getMatriculasPorTurma(idTurma) {
    const matriculas = await this.db
      .select("*")
      .from("matriculas")
      .where({ turma_id: idTurma });

    return matriculas;
  }

  matriculasLoader = new DataLoader(this.getMatriculasPorEstudante.bind(this));

  async getMatriculasPorEstudante(idEstudantes) {
    const matriculas = await this.db
      .select("*")
      .from("matriculas")
      .whereIn("estudante_id", idEstudantes)
      .select();
    // console.log(matriculas);
    const arrayFinal = idEstudantes.map((id) =>
      matriculas.filter((matricula) => matricula.estudante_id === id),
    );
    console.log(arrayFinal);
    return arrayFinal;
  }
}

module.exports = MatriculasAPI;
