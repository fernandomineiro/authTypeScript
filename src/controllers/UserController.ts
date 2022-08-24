import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import axios from "axios";

import { User } from "../entity/User";
import { Movie } from "../entity/Movie";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    const movie = getRepository(Movie);
    const movies = await movie.find({
      select: ["id", "title", "category", "pagination"],
    });

    res.send(movies);
  };

  static getMovieById = async (req: Request, res: Response) => {
    const id: number = req.params.id;

    //Get the user from database
    const movie = getRepository(Movie);
    try {
      const user = await movie.findOneOrFail(id, {
        select: ["id", "title", "category", "pagination"],
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("Filme não encontrado");
    }
  };

  static getCEP = async (req: Request, res: Response) => {
    let { cep } = req.body;

    const data = JSON.stringify({
      date: "",
      env: "",
      event: "PAYMENT.CANCELLED",
      resource: {
        payment: {
          fundingInstrument: { method: "BILLET" },
          id: "PAY-KLTBHO7Y480J",
          status: "CANCELLED",
        },
      },
    });

    let config = {
      method: "get",
      url: `viacep.com.br/ws/${cep}/json/`,
      headers: {
        Authorization: "OAuth 6efe2e42e0da4989969783c8ea021ac3_v2",
        "Content-Type": "application/json",
        Cookie:
          "AWSALB=hw54ZfaKbFGSvOfUJrh2dLr/agognDJEryOT48UM3ojtrCSdAcJFd33n+EMI1VrWVFaxZgWhAkqHUxPmXru/aSr2RyMXhtPdSiQqJvuj1GfP9D2RFcOOHNBivhfO; AWSALBCORS=hw54ZfaKbFGSvOfUJrh2dLr/agognDJEryOT48UM3ojtrCSdAcJFd33n+EMI1VrWVFaxZgWhAkqHUxPmXru/aSr2RyMXhtPdSiQqJvuj1GfP9D2RFcOOHNBivhfO",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.status(200).send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.status(400).send(error);
      });
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let {
      name,
      date,
      email,
      public_place,
      number,
      complement,
      district,
      city,
      state,
      password,
    } = req.body;
    let user = new User();
    user.name = name;
    user.date = date;
    user.email = email;
    user.public_place = public_place;
    user.number = number;
    user.complement = complement;
    user.district = district;
    user.city = city;
    user.state = state;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();

    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("usuário já existente");
      return;
    }
    res.status(201).send("criado com sucesso");
  };

  static editMovie = async (req: Request, res: Response) => {
    const id = req.params.id;

    const { title, category } = req.body;

    const movieR = getRepository(Movie);
    let movie;
    try {
      movie = await movieR.findOneOrFail(id);
    } catch (error) {
      res.status(404).send(" Filme não encontrado");
      return;
    }

    movie.title = title;
    movie.category = category;
    const errors = await validate(movie);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await movieR.save(movie);
    } catch (e) {
      res.status(409).send("Title já em uso");
      return;
    }
    res.status(204).send();
  };

  static deleteMovie = async (req: Request, res: Response) => {
    const id = req.params.id;

    const movieR = getRepository(Movie);
    let movie: Movie;
    try {
      movie = await movieR.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Filme não encontrado");
      return;
    }
    movieR.delete(id);

    res.status(204).send();
  };
}

export default UserController;
