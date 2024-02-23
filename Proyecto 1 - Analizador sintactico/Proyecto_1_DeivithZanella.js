//Realizado por : Br Deivith Jose Zanella Gonzalez - C.I : 28.564.281
//Asignatura : Lenguajes de Programacion
//Profesor : Lic. Alfredo Arabia
//Proyecto 1 .

// <expresion> ::= <termino> | <termino> <operador> <termino> 
// <termino> ::= <numero> | <variable> | <funcion> | "(" <expresion> ")" | <potencia>
// <potencia> ::= <termino> "^" <termino>
// <numero> ::= <digito> | <operador_Aditivo> <numero>
// <digito> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | ...
// <variable> ::= <letra> | <palabra>
// <palabra> ::= <letra> <variable>
// <letra> ::= "a" | "b" | "c" | ... | "z" | "A" | "B" | "C" | ... | "Z"
// <operador_Aditivo> ::= "+" | "-"
// <operador_Multiplicativo> ::= "*" | "/" 
// <operador> ::= "+" | "-" | "*" | "/" | "=" | "_" | "."
// <funcion> ::= "sin('<expresion>')" | "cos'('<expresion>')'"" | "tan'('<expresion>')'"" | "log'('<expresion>')'"" | "exp'('<expresion>')'"" | "sqrt'('<expresion>')'""

//Defino algunos arreglos con los simbolos que se compararan algunas reglas algebraicas
const Letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's','t', 'u', 'v', 'w', 'x', 'y', 'z','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S','T', 'U', 'V', 'W', 'X', 'Y', 'Z','(',')'];
const Digitos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const Operador_Aditivo = ['+','-'];
const Operador_Multiplicativo = ['*','/','^','=','_','.',','];
const Operadores = ['+','-','*','/','^','=','_','.',',']
const Funciones = ['Sin','Sen','Cos','Tan','Log','sin','sen', 'cos', 'tan', 'log', 'exp','sqrt'];
//Todos estos simbolos son los que componen mi notacion EBNF

const fs = require('fs');
//Funcion para comparar la palabra de la linea
function Comparar(tokken,errores){
  errores.valor = 0;
	for (let i = 0; i < tokken.length; i++) { 
    	if (!Digitos.includes(tokken[i]) && !Letras.includes(tokken[i]) && !Operador_Aditivo.includes(tokken[i]) && !Operador_Multiplicativo.includes(tokken[i])) {
      		//console.log('Caracter no valido ');//Compruebo si los caracteres pertenecen a mis elementos validos en el EBNF
    	  errores.valor++; 
      }
  }
  if (tokken.length > 1) {//Comprobar que no inicio con operador multiplicativo o termine en algun operador
  	const primerCaracter = tokken.charAt(0);
  	const ultimoCaracter = tokken.charAt(tokken.length - 1);
  	if (Operador_Multiplicativo.includes(primerCaracter)) {
      errores.valor++;
    	//console.log('El primer caracter es un operador multiplicativo');
    }
    if (Operador_Multiplicativo.includes(ultimoCaracter) || Operador_Aditivo.includes(ultimoCaracter)){
      errores.valor++;
      //console.log('El ultimo caracter es un operador')
    }
	}
	for (let i = 0; i < tokken.length - 1; i++) {//Recorro caracter por caracter de la expresion para ver si no hay operadores consecutivos
  	const simboloActual = tokken[i];
  	const simboloSiguiente = tokken[i + 1];
  	//verifico que no hayan operadores consecutivos
  	if ((Operador_Aditivo.includes(simboloActual) && Operador_Aditivo.includes(simboloSiguiente)) || (Operador_Multiplicativo.includes(simboloActual) && Operador_Multiplicativo.includes(simboloSiguiente))) {
      errores.valor++;
    	//console.log('Hay operadors repetidos');
    }	
	}//Procedo a comparar que los parentesis que se aperturen se cierren 
	let parentesisAbiertos = 0;
	let parentesisCerrados = 0;
	for (let i = 0; i < tokken.length; i++) {
  	const caracter = tokken[i];
  	if (caracter === '(') {
      parentesisAbiertos++;
  	} else if (caracter === ')') {
    	parentesisCerrados++;
    	if (parentesisCerrados > parentesisAbiertos) {
        errores.valor++;
      	//console.log('Parentesis cerrado sin aperturar');
      	return;
    	}// Paréntesis cerrado sin apertura correspondiente
  	} else if ((caracter === ' ' || caracter === '\n') && parentesisAbiertos > parentesisCerrados) {
    	//console.log('Parentesis no cerrado');
    	return;
  		}// Encontró un espacio en blanco o un salto de línea antes de cerrar un paréntesis
	}
	if (parentesisAbiertos > parentesisCerrados) {//Debe haber la mismma cantidad de abiertos que cerrados
  	//console.log('Parentesis no cerrado');
    errores.valor++;
  }// Paréntesis no cerrado al final de la expresion
  for (let i = 0; i < tokken.length - 1; i++) {//Recorro los caracteres para corroborar que no hayan parentesis vacios
    const simboloActual = tokken[i];
    const simboloSiguiente = tokken[i + 1];
    if (simboloActual == '(' && simboloSiguiente == ')') {//Parentesis sin nada adentro
      errores.valor++;
      //console.log('Hay Parentesis sin contenido');
    }
  }
  for (let i = 0; i < tokken.length - 1; i++) {//Recorro caracter por caracter de la expresion para ver si no hay operadores seguido de un cierre de parentesis
    const simboloActual = tokken[i];
    const simboloSiguiente = tokken[i + 1];
    if (Operadores.includes(simboloActual) && simboloSiguiente == ')') {//verifico que no hayan operadores seguido de un cierre de parentesis
      errores.valor++;
      //console.log('Hay operadores seguido de un cierre de parentesis');
    } 
  }
  for (let i = 0 ; i <= tokken.length - 3; i++){
    const subcadena = tokken.slice(i,i+3);//Verifico caracteres de 3 en tres para validar las trigonometricas
    if (Funciones.includes(subcadena)){
      //console.log(`Es una expresion trigonometrica`);
      const DisqueParentesis = tokken[i+3];
      if(Operadores.includes(DisqueParentesis)){//console.log(`Hay un operador antes del parentesis de la expresion trigonometrica`)
        errores.valor++;
      }//Si se cumple significa que no sigue la sintaxis de las expresiones trigonometricas <trigonometrica>(<expresion>)
    }
  }
}

// Función para verificar si un archivo existe
function archivoExiste(archivo, contador = 1) {
  if (fs.existsSync(archivo)) {
    const extension = archivo.split('.').pop(); // Obtener la extensión del archivo
    const nombreBase = archivo.slice(0, archivo.lastIndexOf('.')); // Obtener el nombre base sin la extensión
    const nuevoArchivo = `${nombreBase} (${contador}).${extension}`; // Construir el nuevo nombre de archivo con el contador en paréntesis

    return archivoExiste(nuevoArchivo, contador + 1); // Llamar recursivamente con un contador incrementado si el archivo ya existe
  }

  return archivo; // Devolver el nombre de archivo si no existe
}

//Funcion donde se realiza la lectura
function lectura(archivo) {
  if (!fs.existsSync(archivo)) {
    console.log(`El archivo "${archivo}" no existe.`);
    return;
  }
  //Asigno el nombre de errores.txt al archivo de salida
  let archivoErrores = 'errores.txt';
  //Verifico si el archivo de errores existe
  if (fs.existsSync(archivoErrores)) {
    const nuevoArchivoErrores = archivoExiste(archivoErrores);
    console.log(`El archivo "${archivoErrores}" ya existe. Creando "${nuevoArchivoErrores}"... \n`);
    archivoErrores = nuevoArchivoErrores;
  }
  //Leemos el archivo
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }

    const lineas = data.split('\n');
    let resultado = ''; // Variable para almacenar el resultado a escribir en el archivo

    lineas.forEach((linea, numeroLinea) => {
      let Errores = { valor: 0 }; // Crear un objeto para almacenar el valor de errores por línea
      //Divido la linea en palabras o caracteres individuales
      const palabras = linea.split(' ');
      palabras.forEach((palabra) => {
        const contenidoPalabra = palabra.trim();
        Comparar(contenidoPalabra, Errores);//Comparo las palabras
      });
      //El numero de lineas 
      const numeroLineaTexto = numeroLinea + 1;
      if (Errores.valor == 0) {//Si no hay errores sintaxis ok
        resultado += `Linea ${numeroLineaTexto}: SINTAXIS OK\n`;
      } else {
        resultado += `Linea ${numeroLineaTexto}: Numero de Errores ${Errores.valor}\n`;
      }//Si hay errores pongo el numero de errores
    });
    //Creo mi archivo de error
    fs.writeFile(archivoErrores, resultado, 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
      }
      console.log(`Archivo "${archivoErrores}" creado exitosamente.`);
    });
  });
}

const archivoPrueba = 'EXPRESION.txt';
if (fs.existsSync(archivoPrueba)) {
  lectura(archivoPrueba);
} else {
  console.log(`El archivo "${archivoPrueba}" no existe.`);
}