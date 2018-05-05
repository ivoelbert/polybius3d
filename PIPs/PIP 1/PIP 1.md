# PIP 1

## Unificación de la página

En la fecha corriente (4 mayo 2018) el Polybius3d está dividido en 3 páginas: index.html, selection.html, polybius3d.html

* [index.html](https://github.com/ivoelbert/polybius3d/blob/master/index.html) -- Página de inicio.
* [selection.html](https://github.com/ivoelbert/polybius3d/blob/master/selection.html) -- Aquí se selecciona la nave con la que se desea jugar.
* [polybius.html](https://github.com/ivoelbert/polybius3d/blob/master/polybius.html) -- Aquí se juega.

La propuesta es unificar todo el juego en una sola página.

El plan para llevar a cabo la unificación es el que sigue:

## 1- Modularización

Dividir el juego en módulos, similar a como se hace en [Common.js](https://github.com/ivoelbert/polybius3d/blob/master/js/Common.js). La modularización propuesta es la siguiente:

### 1.1- CONST

El módulo *CONST* tendrá todas las constantes relevantes del juego.

Por ejemplo la constante *radius* que se utiliza como valor de referencia para escalar tamaños y distancias.

### 1.2- GROUPS

El módulo *GROUPS* incluirá a los grupos de objetos.

Estos grupos incluyen a los objetos del juego del mismo tipo. Por ejemplo, *groupAsteroids* es el grupo de asteroides amarillos que orbitan el centro.
Estos grupos a demás se utilizan para generar las reglas de colisiones (qué objetos colisiona con qué otros).

### 1.3- COMMON

El módulo *COMMON* tendrá un propósito específico: encapsular los valores y métodos que relacionan a varios objetos. El módulo permitirá acceso global, es decir, cualquier objeto puede acceder a los valores y métodos definidos en él. A demás, *COMMON* tendrá referencia a todos los objetos y constantes del juego.

Por ejemplo, el método *ShootMisil(from, to)* permite disparar un misil desde una posición en el espacio (*from*), persiguiendo a un objeto particular (*to*). Es común que el centro le dispare misiles a la nave. Para evitar que el centro tenga referencias a la nave, lo cual sería necesario para que el mismo pueda llamar a *ShootMisil(this.position, nave)*, usaremos el módulo *COMMON*.

En el módulo incluimos el método *shootMisilFromCenter()* que dispara un misil desde el centro persiguiendo a la nave. Esto es posible gracias a que *COMMON* tiene referencia tanto al centro como a la nave. Lo único que definimos es

```javascript

COMMON.shootMisilFromCenter = function() {
  let centerPosition = CENTRO.position.clone();
  let followedObject = NAVE;

  COMMON.shootMisil(centerPosition, followedObject);
}

```

Donde *NAVE* y *CENTRO* serán las referencias correspondientes (Esas referencias se obtienen de los *grupos*. ver el punto 1.2).

Notese que *shootMisil(from, to)* fue incluido en *COMMON* por sentido común, cualquier objeto potencialmente podría tirar un misil a cualquier otro.

### 1.4- ENVIRONMENT

El módulo *ENVIRONMENT* servirá para almacenar todas las variables de estado del juego.

Por ejemplo, la variable global *renderGlitch* es un booleano que determina si se está renderizando el glitch que ocurre cuando la nave recibe daño. Al ser una variable de ambiente, se setea y se observa su estado en varias partes del juego.

Queda por debatir si al igual que *COMMON* debe ser de scope global, o si solo *COMMON* la verá y permitirá la vista y modificación de sus variables mediante métodos.



#### EN CONSTRUCCIÓN ####

## 2- Pre-carga de recursos

Se debe formalizar la pre-carga de recursos del juego.

Los mismos incluyen modelos 3d, sonidos, etc.

Proponer a debate si se deben cargar todos los recursos necesarios al principio del juego o si se deben cargar solo los necesarios para cada sección. Ventajas y desventajas.

## 3- Separación por escenas

Una variable de *ENVIROMENT* dirá en que sección del juego estamos y se elegirá la escena a renderizar (y actualizar) en base a eso.

## 4- Construccion de transiciones

Se debe construir un sistema de transición entre escenas.

Por ejemplo, cuando estamos eligiendo la nave se renderizará la escena de selección, una vez seleccionada la nave, se debe transicionar a la escena de juego.

## ... 5- ?
