:- use_module(library(clpfd)).

% Proyecto 3 . Br. Deivith Zanella 28.564.281

% Estos dos modulos es para poder procesarlos como dominio finito 
% procesar_fila : Transforma una fila aplicando la regla procesar_celda a cada elemento.
procesar_fila(Fila, FilaPreparada) :-
    maplist(procesar_celda, Fila, FilaPreparada).

% Transforma una celda en X aplicando una regla.
% Si es variable, se establece una restricción de dominio finito de 0 a 1 en X.
procesar_celda(Var, X) :- var(Var), !, X in 0..1.
procesar_celda(Val, Val).

% Verifico las condiciones que debe cumplir la fila
% Llama a los predicados verificar_igualdad y verificar_repeticion.
condiciones_fila(Fila) :-
    verificar_igualdad(Fila),
    verificar_repeticion(Fila).

% Verifico que haya la misma cantidad de 0 y 1
% Utilizo global_cardinality para contar las ocurrencias y sum para calcular la suma.
verificar_igualdad(Fila) :-
    global_cardinality(Fila, [0-_, 1-_]),
    sum(Fila, #=, Sum),
    length(Fila, Longitud),
    Sum * 2 #= Longitud.
    
% Verifico que no haya más de dos celdas consecutivas con el mismo valor.
verificar_repeticion([]).
verificar_repeticion([_]).
verificar_repeticion([_, _]).
verificar_repeticion([X, Y, Z | Tail]) :-
    (X #\= Y; Y #\= Z),
    verificar_repeticion([Y, Z | Tail]).

% Nota : al incluir estos modulos de verificar filas y columnas me dejo de resolver matrices 8x8 y 10x10 :(((
% Para verificar que ninguna fila sea igual a otra
verificar_filas_distintas([]).
verificar_filas_distintas([Fila|Filas]) :-
    \+ member(Fila, Filas),
    verificar_filas_distintas(Filas).

% Para verificar que ninguna columna sea igual a otra
verificar_columnas_distintas(Matriz) :-
    transpose(Matriz, Transpuesta),
    verificar_filas_distintas(Transpuesta).

% Para resolver la matrices, llamo a los modulos
solucionar(FilasConPistas) :-
    maplist(procesar_fila, FilasConPistas, MatrizPreparada),
    maplist(condiciones_fila, MatrizPreparada),
    transpose(MatrizPreparada, Transpuesta),
    maplist(condiciones_fila, Transpuesta),
    append(MatrizPreparada, Vars),
    labeling([], Vars),
    verificar_filas_distintas(MatrizPreparada),
    verificar_columnas_distintas(MatrizPreparada),
    maplist(writeln, MatrizPreparada).

% verificar_simetria_dimensiones : Verifica si una matriz es simétrica y tiene dimensiones válidas.
verificar_simetria_dimensiones(Matriz) :-
    length(Matriz, N),
    N mod 2 =:= 0, % Verificar que el tamaño de la matriz sea par
    verificar_simetria_dimensiones_aux(Matriz, N).

% Esto para poder comprobar que sean 2x2 4x4 6x6 8x8 10x10 si no cumple devuelve false
verificar_simetria_dimensiones_aux([], _).
verificar_simetria_dimensiones_aux([Fila|Filas], N) :-
    length(Fila, N), % Verificar que todas las filas tengan la misma longitud
    verificar_simetria_dimensiones_aux(Filas, N).

% Resuelvo la matriz, pero primero compruebo la simetria
matriz(Matriz) :-
    verificar_simetria_dimensiones(Matriz),
    solucionar(Matriz).

% Ejemplo de uso: matriz([[_,_],[0,_]]).
% matriz([[_,_,1,_],[0,_,_,_],[0,_,_,_],[_,_,_,_]]).
% Ojo este lo resuelve pero tarda un poco matriz([[0,_,_,_,_,_], [_,_,1,0,_,_], [_,_,1,1,_,_], [_,_,_,0,1,_],[_,1,_,1,1,_], [_,_,_,_,_,_]]).
% matriz([[_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_], [_,_,_,_,_,_,_,_]]).
% matriz([ [_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_] ]).

% Nota : la logica implementada resuelve 2x2 4x4 6x6 , pero por alguna razon no resuelve las 8x8 y 10x10
% puede que la logica que use no sea tan eficiente y por eso se tarde en resolver esas dimensiones