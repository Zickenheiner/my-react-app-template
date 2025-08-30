#!/bin/bash
if [ $# -ne 2 ]; then
    echo "Usage: $0 <file-name> <feature-name>"
    exit 1
fi

FILE_NAME=$1
FILE_NAME_CAPITALIZED=$(echo "$FILE_NAME" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')
FEATURE_NAME=$2
BASE_PATH="src/features/$FEATURE_NAME"

if [ ! -d "$BASE_PATH" ]; then
  ./feature.sh $FEATURE_NAME
fi

# Create the files
touch $BASE_PATH/data/datasources/${FILE_NAME}.api.ts
touch $BASE_PATH/data/repositories/${FILE_NAME}.repository.impl.ts
touch $BASE_PATH/data/mappers/${FILE_NAME}.mapper.ts
touch $BASE_PATH/data/dtos/${FILE_NAME}.dto.ts
touch $BASE_PATH/domain/repositories/${FILE_NAME}.repository.ts
touch $BASE_PATH/domain/entities/${FILE_NAME}.entity.ts
touch $BASE_PATH/application/use-cases/${FILE_NAME}.usecase.ts
touch $BASE_PATH/presentation/hooks/${FILE_NAME}.hook.ts

# Add boilerplate code to the files
echo "import { endpoints, methods, request } from '@/core/config/api';
import type { ${FILE_NAME_CAPITALIZED}ResponseDto } from '../dtos/${FILE_NAME}.dto';

class ${FILE_NAME_CAPITALIZED}Api {
  constructor(private readonly ${FILE_NAME}BaseUrl: string = endpoints.${FILE_NAME}) {}

  // Define your API methods here
}

export default ${FILE_NAME_CAPITALIZED}Api;" > $BASE_PATH/data/datasources/${FILE_NAME}.api.ts

echo "import type { ${FILE_NAME_CAPITALIZED}Repository } from '../../domain/repositories/${FILE_NAME}.repository';
import type { ${FILE_NAME_CAPITALIZED}Entity } from '../../domain/entities/${FILE_NAME}.entity';
import ${FILE_NAME_CAPITALIZED}Api from '../datasources/${FILE_NAME}.api';
import ${FILE_NAME_CAPITALIZED}Mapper from '../mappers/${FILE_NAME}.mapper';

class ${FILE_NAME_CAPITALIZED}RepositoryImpl implements ${FILE_NAME_CAPITALIZED}Repository {
  constructor(
    private readonly ${FILE_NAME}Api: ${FILE_NAME_CAPITALIZED}Api = new ${FILE_NAME_CAPITALIZED}Api(),
    private readonly ${FILE_NAME}Mapper: ${FILE_NAME_CAPITALIZED}Mapper = new ${FILE_NAME_CAPITALIZED}Mapper(),
  ) {}

  // Define your repository methods here
}

export default ${FILE_NAME_CAPITALIZED}RepositoryImpl;" > $BASE_PATH/data/repositories/${FILE_NAME}.repository.impl.ts

echo "import type { ${FILE_NAME_CAPITALIZED}Entity } from '../../domain/entities/${FILE_NAME}.entity';
import type { ${FILE_NAME_CAPITALIZED}ResponseDto } from '../dtos/${FILE_NAME}.dto';

class ${FILE_NAME_CAPITALIZED}Mapper {
  toEntity(dto: ${FILE_NAME_CAPITALIZED}ResponseDto): ${FILE_NAME_CAPITALIZED}Entity {
    return {
        // Map fields from dto to entity here
    };
  }
}

export default ${FILE_NAME_CAPITALIZED}Mapper;" > $BASE_PATH/data/mappers/${FILE_NAME}.mapper.ts

echo "export interface ${FILE_NAME_CAPITALIZED}RequestDto {
  // Define the properties of the ${FILE_NAME_CAPITALIZED}RequestDto here
}

export interface ${FILE_NAME_CAPITALIZED}ResponseDto {
    // Define the properties of the ${FILE_NAME_CAPITALIZED}ResponseDto here
}" > $BASE_PATH/data/dtos/${FILE_NAME}.dto.ts

echo "import type { ${FILE_NAME_CAPITALIZED}Entity } from '../entities/${FILE_NAME}.entity';

export interface ${FILE_NAME_CAPITALIZED}Repository {
    // Define the methods for the ${FILE_NAME_CAPITALIZED}Repository here
}" > $BASE_PATH/domain/repositories/${FILE_NAME}.repository.ts

echo "export interface ${FILE_NAME_CAPITALIZED}Entity {
  // Define the properties of the ${FILE_NAME_CAPITALIZED}Entity here
}" > $BASE_PATH/domain/entities/${FILE_NAME}.entity.ts

echo "import type { ${FILE_NAME_CAPITALIZED}Repository } from '../../domain/repositories/${FILE_NAME}.repository';
import type { ${FILE_NAME_CAPITALIZED}Entity } from '../../domain/entities/${FILE_NAME}.entity';

class ${FILE_NAME_CAPITALIZED}Usecase {
  constructor(private readonly repository: ${FILE_NAME_CAPITALIZED}Repository) {}

  // Define your use case methods here
}

export default ${FILE_NAME_CAPITALIZED}Usecase;" > $BASE_PATH/application/use-cases/${FILE_NAME}.usecase.ts