if [ $# -eq 0 ]; then
    echo "Usage: $0 <feature-name>"
    exit 1
fi

FEATURE_NAME=$1

BASE_PATH="src/features/$FEATURE_NAME"

# Create feature directories
mkdir -p $BASE_PATH/data/datasources
mkdir -p $BASE_PATH/data/repositories
mkdir -p $BASE_PATH/data/mappers
mkdir -p $BASE_PATH/data/dtos
mkdir -p $BASE_PATH/domain/repositories
mkdir -p $BASE_PATH/domain/entities
mkdir -p $BASE_PATH/application/use-cases
mkdir -p $BASE_PATH/application/ports
mkdir -p $BASE_PATH/presentation/hooks
mkdir -p $BASE_PATH/presentation/pages
mkdir -p $BASE_PATH/presentation/components



