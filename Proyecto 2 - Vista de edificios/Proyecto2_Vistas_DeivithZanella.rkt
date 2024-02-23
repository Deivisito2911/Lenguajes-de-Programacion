#lang racket
;Profesor : Lic. Alfredo Arabia
;Estudiante : Br. Deivith Zanella C.I : 28.564.281
;Materia : Lenguajes de Programacion
;Universidad de Oriente Nucleo Nueva Esparta (UDONE)

;Esta funcion verifica si un un valor es valido en una posicion del tablero
(define (is-valid board row col value N top bottom left right)
  (let* ([row-values (vector->list (list-ref board row))];Obtengo los valores de la fila y columna actual
         [col-values (map (lambda (r) (vector-ref (list-ref board r) col)) (range N))];Convierto la fila en una lista
         [in-row? (member value row-values)];Obtengo los valores de la columna
         [in-col? (member value col-values)]);Verifico si el valor ya existe en una fila
    (if (or in-row? in-col?)
        #f;Si el valor ya existe es falso
        (valid-seen? board row col value N row-values col-values right bottom))));Las restricciones de visibilidad

;Funcion para verificar si un valor cuple las restricciones de visibilidad en una fila o columna
(define (valid-seen? board row col value N row-values col-values right bottom)
  (let* ([right-seen (if (= col (- N 1));Si es la ultima columna, calcula la cantidad de elementos visibles desde la derecha
                         (let loop ([i (- N 2)] [max-height value] [seen 1])
                           (if (< i 0)
                               seen
                               (if (> (list-ref row-values i) max-height) ; Usa list-ref aquí
                                   (loop (- i 1) (list-ref row-values i) (+ seen 1)) ; Usa list-ref aquí
                                   (loop (- i 1) max-height seen))))
                         0)]
         [bottom-seen (if (= row (- N 1));Si es la ultima fila, calcula la cantidad de elementos visibles desde abajo
                          (let loop ([i (- N 2)] [max-height value] [seen 1])
                            (if (< i 0)
                                seen
                                (if (> (vector-ref (list-ref board i) col) max-height)
                                    (loop (- i 1) (vector-ref (list-ref board i) col) (+ seen 1))
                                    (loop (- i 1) max-height seen))))
                          0)]);Compruebo las restricciones de visibilidad
    (if (or (and (> right-seen 0) (not (= right-seen (list-ref right row))));Compruebo la visibilidad de la derecha ; Usa list-ref aquí
            (and (> bottom-seen 0) (not (= bottom-seen (list-ref bottom col)))));Compruebo la visibilidad desde abajo ; Usa list-ref aquí
        #f ;Si no se cumplen no es valido
        #t)));Si se cumplen es valido

;Funcion principal para resolver el problema con backtracking
(define (solve board row col N top bottom left right)
  (if (= row N);Verifica si alcanzo la ultima fila para mostrar la solucion
      (begin (display "Solucion :\n") (for-each (lambda (r) (display r) (newline)) board))
      (if (= col N);Verifica si ha alcanzado la ultima columna para pasar a la siguiente fila
          (solve board (+ row 1) 0 N top bottom left right);Uso un proceso iterativo a traves de los valores posibles para esa posicion
          (let loop ([value 1]);Verifico si es valido en esa posicion
            (if (> value N)
                #f;Si no hay valores posibles retorna falso
                (if (is-valid board row col value N top bottom left right);Si es valido lo coloco y continuo con la siguiente columna
                    (begin
                      (set-board-value! board row col value) ; Usa set-board-value! aquí
                      (if (solve board row (+ col 1) N top bottom left right)
                          #t;Al encontrar solucion devuelvo verdadero y termino la recursion
                          (begin;Si no retrocede e intenta con el siguiente valor
                            (set-board-value! board row col 0) ; Usa set-board-value! aquí
                            (loop (+ value 1)))));Si el valor no es valido continuo con el siguiente
                    (loop (+ value 1))))))))

(define (set-board-value! board row col value);Esta establece el valor en una posicion
  (vector-set! (list-ref board row) col value)) ; Usa list-ref aquí

;Mi main que es la que llamara a las otras funciones
(define (vistas views)
  (let* ([N (length (car views))]
         [top (car views)];Norte
         [bottom (cadr views)];Sur
         [left (caddr views)];Este
         [right (cadddr views)];Oeste
         [board (for/list ([i N]) (make-vector N 0))]);Tamano de mi tablero
    (solve board 0 0 N top bottom left right)))
;Vistas de ejemplo :
;(vistas '((3 1 2 3 4)(1 3 3 2 2)(2 2 4 3 1)(3 2 2 1 3)))
;(vistas '((1 2 2)(3 2 1)(1 2 3)(2 2 1)))
;(vistas'((3 1 2 2)(2 3 1 2)(2 2 1 3)(3 1 3 2)))
