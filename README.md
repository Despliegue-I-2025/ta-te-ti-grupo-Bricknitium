### **Proyecto de Batalla de Bots de Tateti**
Este proyecto presenta una implementación simple del clásico juego de Tateti (Tres en Raya) en JavaScript, con un enfoque en la inteligencia artificial a través de bots que compiten entre sí. El objetivo principal fue explorar y demostrar el potencial de JavaScript como un lenguaje versátil y potente para el desarrollo de lógica de juegos y algoritmos complejos.

### **¿Por qué JavaScript?**
Aunque JavaScript es comúnmente asociado con el desarrollo web del lado del cliente, su ecosistema moderno y sus características de alto rendimiento lo convierten en una excelente opción para la creación de algoritmos. Este proyecto es una prueba de concepto que demuestra cómo JavaScript puede manejar la lógica de un juego determinista de manera eficiente y elegante, sin necesidad de librerías externas para el núcleo del algoritmo. Su flexibilidad permite la integración fluida de la lógica de IA con una interfaz de usuario, ofreciendo una experiencia completa dentro de un mismo entorno.

### **Resumen del Algoritmo Minimax**

El corazón de la inteligencia de los bots en este proyecto es el algoritmo Minimax. Este algoritmo recursivo es una estrategia fundamental en la teoría de juegos para encontrar el movimiento óptimo. Funciona de la siguiente manera:

• **MiniMax como un árbol de decisiones:** El algoritmo construye un "árbol de juego" que representa todas las posibles secuencias de movimientos que pueden ocurrir a partir de la situación actual.

• **Valoración de nodos**: Cada nodo (o estado del tablero) en el árbol recibe un valor numérico. El valor es alto si el estado es favorable para el jugador actual y bajo si es favorable para el oponente.

### • Maximizar y Minimizar:

• **El jugador maximizador** (el bot que está pensando en el movimiento) busca el camino que lo lleva al estado con el valor más alto posible.

• **El jugador minimizador** (el oponente) busca el camino que lo lleva al estado con el valor más bajo posible.

• **Selección del movimiento:** Al final, el bot elige el movimiento que lo lleva al estado con el mayor valor, asumiendo que el oponente también jugará de manera óptima para minimizar su propio resultado.

El algoritmo Minimax garantiza que, si se implementa correctamente, el bot nunca perderá una partida si existe una posibilidad de empate o victoria, haciendo de este un oponente imbatible en un juego como el Tateti.

### **Créditos**
Este trabajo ha sido desarrollado colaborativamente por:

• ****Loyola Lautaro****

• **Parejas Lucas**

• **Romero Valentina**

• **Uziel Gamarra**.
