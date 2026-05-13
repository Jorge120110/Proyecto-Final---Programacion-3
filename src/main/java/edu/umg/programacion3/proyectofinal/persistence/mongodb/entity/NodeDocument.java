package edu.umg.programacion3.proyectofinal.persistence.mongodb.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "nodes")
public class NodeDocument {
	
	@Id
	private String id;
	
	private String value;
}
