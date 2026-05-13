package edu.umg.programacion3.proyectofinal.persistence.mongodb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import edu.umg.programacion3.proyectofinal.persistence.mongodb.entity.NodeDocument;

public interface NodeMongoRepository extends MongoRepository<NodeDocument, String> {

}
