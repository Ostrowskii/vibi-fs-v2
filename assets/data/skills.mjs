export const SKILLS = [
  {
    "id": 1,
    "slug": "RustSlash",
    "label": "Rust Slash",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 55,
    "rank": 1,
    "damage": 10,
    "hookPull": 0,
    "description": "Linha curta de tres casas para abrir espaco no melee.",
    "shape": [
      [
        "A",
        "A",
        "A"
      ]
    ],
    "width": 3,
    "height": 1,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 2,
        "y": 0,
        "token": "A",
        "mask": 1
      }
    ],
    "anchors": [],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      }
    ],
    "attackCells": [
      {
        "x": 0,
        "y": 0,
        "token": "A"
      },
      {
        "x": 1,
        "y": 0,
        "token": "A"
      },
      {
        "x": 2,
        "y": 0,
        "token": "A"
      }
    ]
  },
  {
    "id": 2,
    "slug": "CornerSweep",
    "label": "Corner Sweep",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 70,
    "rank": 1,
    "damage": 10,
    "hookPull": 0,
    "description": "L irregular que cobre frente e diagonal curta.",
    "shape": [
      [
        "A",
        "",
        ""
      ],
      [
        "A",
        "A",
        ""
      ],
      [
        "",
        "A",
        ""
      ]
    ],
    "width": 3,
    "height": 3,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 0,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 2,
        "token": "A",
        "mask": 1
      }
    ],
    "anchors": [],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      }
    ],
    "attackCells": [
      {
        "x": 0,
        "y": 0,
        "token": "A"
      },
      {
        "x": 0,
        "y": 1,
        "token": "A"
      },
      {
        "x": 1,
        "y": 1,
        "token": "A"
      },
      {
        "x": 1,
        "y": 2,
        "token": "A"
      }
    ]
  },
  {
    "id": 3,
    "slug": "TwinPike",
    "label": "Twin Pike",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 82,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Dois pares de ataque em diagonal para fechar corredor.",
    "shape": [
      [
        "A",
        "A",
        "",
        ""
      ],
      [
        "",
        "",
        "A",
        "A"
      ]
    ],
    "width": 4,
    "height": 2,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 2,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 3,
        "y": 1,
        "token": "A",
        "mask": 1
      }
    ],
    "anchors": [],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      }
    ],
    "attackCells": [
      {
        "x": 0,
        "y": 0,
        "token": "A"
      },
      {
        "x": 1,
        "y": 0,
        "token": "A"
      },
      {
        "x": 2,
        "y": 1,
        "token": "A"
      },
      {
        "x": 3,
        "y": 1,
        "token": "A"
      }
    ]
  },
  {
    "id": 4,
    "slug": "HookRail",
    "label": "Hook Rail",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 96,
    "rank": 2,
    "damage": 0,
    "hookPull": 2,
    "description": "Linha inteira de hooks para puxar o alvo sem dano.",
    "shape": [
      [
        "H",
        "H",
        "H",
        "H",
        "H"
      ]
    ],
    "width": 5,
    "height": 1,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 1,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 2,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 3,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 4,
        "y": 0,
        "token": "H",
        "mask": 2
      }
    ],
    "anchors": [],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      }
    ],
    "attackCells": [
      {
        "x": 0,
        "y": 0,
        "token": "H"
      },
      {
        "x": 1,
        "y": 0,
        "token": "H"
      },
      {
        "x": 2,
        "y": 0,
        "token": "H"
      },
      {
        "x": 3,
        "y": 0,
        "token": "H"
      },
      {
        "x": 4,
        "y": 0,
        "token": "H"
      }
    ]
  },
  {
    "id": 5,
    "slug": "ChainBreaker",
    "label": "Chain Breaker",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 120,
    "rank": 3,
    "damage": 12,
    "hookPull": 2,
    "description": "Ancora o lutador, puxa o alvo e fecha com dano no ultimo elo.",
    "shape": [
      [
        "P",
        "H",
        "H",
        "H",
        "DH"
      ]
    ],
    "width": 5,
    "height": 1,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 1,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 2,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 3,
        "y": 0,
        "token": "H",
        "mask": 2
      },
      {
        "x": 4,
        "y": 0,
        "token": "DH",
        "mask": 3
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      }
    ],
    "attackCells": [
      {
        "x": 1,
        "y": 0,
        "token": "H"
      },
      {
        "x": 2,
        "y": 0,
        "token": "H"
      },
      {
        "x": 3,
        "y": 0,
        "token": "H"
      },
      {
        "x": 4,
        "y": 0,
        "token": "DH"
      }
    ]
  },
  {
    "id": 6,
    "slug": "ForgeCross",
    "label": "Forge Cross",
    "classId": 0,
    "classKey": "melee",
    "shop": "blacksmith",
    "price": 92,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Cruz compacta para dominar o centro da arena.",
    "shape": [
      [
        "",
        "A",
        ""
      ],
      [
        "A",
        "A",
        "A"
      ],
      [
        "",
        "A",
        ""
      ]
    ],
    "width": 3,
    "height": 3,
    "classLabel": "Melee",
    "cells": [
      {
        "x": 1,
        "y": 0,
        "token": "A",
        "mask": 1
      },
      {
        "x": 0,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 2,
        "y": 1,
        "token": "A",
        "mask": 1
      },
      {
        "x": 1,
        "y": 2,
        "token": "A",
        "mask": 1
      }
    ],
    "anchors": [],
    "occupied": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      }
    ],
    "attackCells": [
      {
        "x": 1,
        "y": 0,
        "token": "A"
      },
      {
        "x": 0,
        "y": 1,
        "token": "A"
      },
      {
        "x": 1,
        "y": 1,
        "token": "A"
      },
      {
        "x": 2,
        "y": 1,
        "token": "A"
      },
      {
        "x": 1,
        "y": 2,
        "token": "A"
      }
    ]
  },
  {
    "id": 7,
    "slug": "Pinshot",
    "label": "Pinshot",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 60,
    "rank": 1,
    "damage": 10,
    "hookPull": 0,
    "description": "Coluna fina de dano distante para pressure linear.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 8,
        "y": 1,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 8,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 8,
        "y": 3,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 8,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 8,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 8,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 8,
        "y": 1,
        "token": "D"
      },
      {
        "x": 8,
        "y": 2,
        "token": "D"
      },
      {
        "x": 8,
        "y": 3,
        "token": "D"
      }
    ]
  },
  {
    "id": 8,
    "slug": "TwinSpire",
    "label": "Twin Spire",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 88,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Dois pilares de dano no fim do corredor do arco.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 1,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 1,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 3,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 3,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 8,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 8,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 8,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 7,
        "y": 1,
        "token": "D"
      },
      {
        "x": 8,
        "y": 1,
        "token": "D"
      },
      {
        "x": 7,
        "y": 2,
        "token": "D"
      },
      {
        "x": 8,
        "y": 2,
        "token": "D"
      },
      {
        "x": 7,
        "y": 3,
        "token": "D"
      },
      {
        "x": 8,
        "y": 3,
        "token": "D"
      }
    ]
  },
  {
    "id": 9,
    "slug": "FalconCross",
    "label": "Falcon Cross",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 98,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Cruz concentrada no centro do bloco de impacto distante.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "D",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 1,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 7,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 3,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 8,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 7,
        "y": 1,
        "token": "D"
      },
      {
        "x": 6,
        "y": 2,
        "token": "D"
      },
      {
        "x": 7,
        "y": 2,
        "token": "D"
      },
      {
        "x": 8,
        "y": 2,
        "token": "D"
      },
      {
        "x": 7,
        "y": 3,
        "token": "D"
      }
    ]
  },
  {
    "id": 10,
    "slug": "CanyonRain",
    "label": "Canyon Rain",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 112,
    "rank": 3,
    "damage": 11,
    "hookPull": 0,
    "description": "Barragens horizontais no topo e na base do canvas ranged.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "D",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "D",
        "D"
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 7,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 4,
        "token": "D",
        "mask": 1
      },
      {
        "x": 7,
        "y": 4,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 4,
        "token": "D",
        "mask": 1
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 7,
        "y": 0
      },
      {
        "x": 8,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 7,
        "y": 4
      },
      {
        "x": 8,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 6,
        "y": 0,
        "token": "D"
      },
      {
        "x": 7,
        "y": 0,
        "token": "D"
      },
      {
        "x": 8,
        "y": 0,
        "token": "D"
      },
      {
        "x": 7,
        "y": 2,
        "token": "D"
      },
      {
        "x": 6,
        "y": 4,
        "token": "D"
      },
      {
        "x": 7,
        "y": 4,
        "token": "D"
      },
      {
        "x": 8,
        "y": 4,
        "token": "D"
      }
    ]
  },
  {
    "id": 11,
    "slug": "MirrorCorners",
    "label": "Mirror Corners",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 118,
    "rank": 3,
    "damage": 11,
    "hookPull": 0,
    "description": "Pares espelhados nos cantos com um centro de ajuste.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "",
        "D"
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 4,
        "token": "D",
        "mask": 1
      },
      {
        "x": 8,
        "y": 4,
        "token": "D",
        "mask": 1
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 8,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 8,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 6,
        "y": 0,
        "token": "D"
      },
      {
        "x": 8,
        "y": 0,
        "token": "D"
      },
      {
        "x": 7,
        "y": 2,
        "token": "D"
      },
      {
        "x": 6,
        "y": 4,
        "token": "D"
      },
      {
        "x": 8,
        "y": 4,
        "token": "D"
      }
    ]
  },
  {
    "id": 12,
    "slug": "FrostZig",
    "label": "Frost Zig",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 62,
    "rank": 1,
    "damage": 9,
    "hookPull": 0,
    "description": "Ancora em zigzag curto e gelo projetado adiante.",
    "shape": [
      [
        "P",
        "",
        "",
        "",
        "",
        "I",
        ""
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "I",
        "I"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "I",
        ""
      ]
    ],
    "width": 7,
    "height": 3,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "I",
        "mask": 4
      },
      {
        "x": 1,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 2,
        "token": "I",
        "mask": 4
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "I"
      },
      {
        "x": 5,
        "y": 1,
        "token": "I"
      },
      {
        "x": 6,
        "y": 1,
        "token": "I"
      },
      {
        "x": 5,
        "y": 2,
        "token": "I"
      }
    ]
  },
  {
    "id": 13,
    "slug": "FlameZig",
    "label": "Flame Zig",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 78,
    "rank": 1,
    "damage": 9,
    "hookPull": 0,
    "description": "Versao de fogo do zigzag curto, boa para burn persistente.",
    "shape": [
      [
        "P",
        "",
        "",
        "",
        "",
        "F",
        ""
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "F",
        "F"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "F",
        ""
      ]
    ],
    "width": 7,
    "height": 3,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "F",
        "mask": 8
      },
      {
        "x": 1,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 6,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 2,
        "token": "F",
        "mask": 8
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "F"
      },
      {
        "x": 5,
        "y": 1,
        "token": "F"
      },
      {
        "x": 6,
        "y": 1,
        "token": "F"
      },
      {
        "x": 5,
        "y": 2,
        "token": "F"
      }
    ]
  },
  {
    "id": 14,
    "slug": "FrostLance",
    "label": "Frost Lance",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 95,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Zigzag alongado com ponta de gelo e dano misturado.",
    "shape": [
      [
        "P",
        "",
        "",
        "",
        "",
        "I",
        ""
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "I",
        "I"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "DI",
        "I"
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "I",
        "I"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "I",
        ""
      ]
    ],
    "width": 7,
    "height": 5,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "I",
        "mask": 4
      },
      {
        "x": 1,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 2,
        "token": "DI",
        "mask": 5
      },
      {
        "x": 6,
        "y": 2,
        "token": "I",
        "mask": 4
      },
      {
        "x": 1,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 3,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 3,
        "token": "I",
        "mask": 4
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 4,
        "token": "I",
        "mask": 4
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "I"
      },
      {
        "x": 5,
        "y": 1,
        "token": "I"
      },
      {
        "x": 6,
        "y": 1,
        "token": "I"
      },
      {
        "x": 5,
        "y": 2,
        "token": "DI"
      },
      {
        "x": 6,
        "y": 2,
        "token": "I"
      },
      {
        "x": 5,
        "y": 3,
        "token": "I"
      },
      {
        "x": 6,
        "y": 3,
        "token": "I"
      },
      {
        "x": 5,
        "y": 4,
        "token": "I"
      }
    ]
  },
  {
    "id": 15,
    "slug": "EmberChevron",
    "label": "Ember Chevron",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 114,
    "rank": 2,
    "damage": 10,
    "hookPull": 0,
    "description": "Chevron de fogo com ponta reforcada em dano elemental.",
    "shape": [
      [
        "P",
        "",
        "",
        "",
        "",
        "DF",
        "F",
        ""
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "F",
        "F",
        "F"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "DF",
        "F",
        ""
      ]
    ],
    "width": 8,
    "height": 3,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 6,
        "y": 0,
        "token": "F",
        "mask": 8
      },
      {
        "x": 1,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 6,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 7,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 2,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 6,
        "y": 2,
        "token": "F",
        "mask": 8
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "DF"
      },
      {
        "x": 6,
        "y": 0,
        "token": "F"
      },
      {
        "x": 5,
        "y": 1,
        "token": "F"
      },
      {
        "x": 6,
        "y": 1,
        "token": "F"
      },
      {
        "x": 7,
        "y": 1,
        "token": "F"
      },
      {
        "x": 5,
        "y": 2,
        "token": "DF"
      },
      {
        "x": 6,
        "y": 2,
        "token": "F"
      }
    ]
  },
  {
    "id": 16,
    "slug": "GlacierCrown",
    "label": "Glacier Crown",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 126,
    "rank": 3,
    "damage": 11,
    "hookPull": 0,
    "description": "Excecao centralizada de gelo, boa para negar corredores.",
    "shape": [
      [
        "",
        "P",
        "",
        "",
        "",
        "I",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "I",
        "I"
      ],
      [
        "",
        "P",
        "",
        "",
        "DI",
        "I",
        "DI"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "I",
        "I"
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "I",
        ""
      ]
    ],
    "width": 7,
    "height": 5,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 1,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "I",
        "mask": 4
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 1,
        "token": "I",
        "mask": 4
      },
      {
        "x": 1,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 4,
        "y": 2,
        "token": "DI",
        "mask": 5
      },
      {
        "x": 5,
        "y": 2,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 2,
        "token": "DI",
        "mask": 5
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 3,
        "token": "I",
        "mask": 4
      },
      {
        "x": 6,
        "y": 3,
        "token": "I",
        "mask": 4
      },
      {
        "x": 1,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 4,
        "token": "I",
        "mask": 4
      }
    ],
    "anchors": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "I"
      },
      {
        "x": 5,
        "y": 1,
        "token": "I"
      },
      {
        "x": 6,
        "y": 1,
        "token": "I"
      },
      {
        "x": 4,
        "y": 2,
        "token": "DI"
      },
      {
        "x": 5,
        "y": 2,
        "token": "I"
      },
      {
        "x": 6,
        "y": 2,
        "token": "DI"
      },
      {
        "x": 5,
        "y": 3,
        "token": "I"
      },
      {
        "x": 6,
        "y": 3,
        "token": "I"
      },
      {
        "x": 5,
        "y": 4,
        "token": "I"
      }
    ]
  },
  {
    "id": 17,
    "slug": "CinderHalo",
    "label": "Cinder Halo",
    "classId": 2,
    "classKey": "mage",
    "shop": "wizard",
    "price": 138,
    "rank": 3,
    "damage": 11,
    "hookPull": 0,
    "description": "Halo elemental de fogo com centro agressivo em DF.",
    "shape": [
      [
        "P",
        "",
        "",
        "",
        "",
        "F",
        ""
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "DF",
        "F"
      ],
      [
        "P",
        "",
        "",
        "",
        "DF",
        "F",
        "DF"
      ],
      [
        "",
        "P",
        "",
        "",
        "",
        "DF",
        "F"
      ],
      [
        "P",
        "",
        "",
        "",
        "",
        "F",
        ""
      ]
    ],
    "width": 7,
    "height": 5,
    "classLabel": "Mage",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 0,
        "token": "F",
        "mask": 8
      },
      {
        "x": 1,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 1,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 6,
        "y": 1,
        "token": "F",
        "mask": 8
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 4,
        "y": 2,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 5,
        "y": 2,
        "token": "F",
        "mask": 8
      },
      {
        "x": 6,
        "y": 2,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 1,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 3,
        "token": "DF",
        "mask": 9
      },
      {
        "x": 6,
        "y": 3,
        "token": "F",
        "mask": 8
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 5,
        "y": 4,
        "token": "F",
        "mask": 8
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 5,
        "y": 0,
        "token": "F"
      },
      {
        "x": 5,
        "y": 1,
        "token": "DF"
      },
      {
        "x": 6,
        "y": 1,
        "token": "F"
      },
      {
        "x": 4,
        "y": 2,
        "token": "DF"
      },
      {
        "x": 5,
        "y": 2,
        "token": "F"
      },
      {
        "x": 6,
        "y": 2,
        "token": "DF"
      },
      {
        "x": 5,
        "y": 3,
        "token": "DF"
      },
      {
        "x": 6,
        "y": 3,
        "token": "F"
      },
      {
        "x": 5,
        "y": 4,
        "token": "F"
      }
    ]
  },
  {
    "id": 18,
    "slug": "BroadVolley",
    "label": "Broad Volley",
    "classId": 1,
    "classKey": "ranged",
    "shop": "bowyer",
    "price": 132,
    "rank": 3,
    "damage": 12,
    "hookPull": 0,
    "description": "Diagonal descendente larga que fecha o espaco frontal do ranged.",
    "shape": [
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "",
        "D"
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "",
        "D",
        ""
      ],
      [
        "P",
        "",
        "P",
        "",
        "",
        "",
        "D",
        "",
        ""
      ]
    ],
    "width": 9,
    "height": 5,
    "classLabel": "Ranged",
    "cells": [
      {
        "x": 0,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 0,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 0,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 1,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 1,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 2,
        "token": "P",
        "mask": 16
      },
      {
        "x": 8,
        "y": 2,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 3,
        "token": "P",
        "mask": 16
      },
      {
        "x": 7,
        "y": 3,
        "token": "D",
        "mask": 1
      },
      {
        "x": 0,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 2,
        "y": 4,
        "token": "P",
        "mask": 16
      },
      {
        "x": 6,
        "y": 4,
        "token": "D",
        "mask": 1
      }
    ],
    "anchors": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "occupied": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 8,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      }
    ],
    "attackCells": [
      {
        "x": 6,
        "y": 0,
        "token": "D"
      },
      {
        "x": 7,
        "y": 1,
        "token": "D"
      },
      {
        "x": 8,
        "y": 2,
        "token": "D"
      },
      {
        "x": 7,
        "y": 3,
        "token": "D"
      },
      {
        "x": 6,
        "y": 4,
        "token": "D"
      }
    ]
  }
];
export const SKILL_BY_ID = new Map(SKILLS.map((skill) => [skill.id, skill]));
export const STARTER_SKILLS = [1, 7, 12];
