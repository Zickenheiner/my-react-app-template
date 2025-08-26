if [ $# -eq 0 ]; then
    echo "Usage: $0 <feature-name>"
    exit 1
fi

FEATURE_NAME=$1

BASE_PATH="src/features/$FEATURE_NAME"

mkdir -p $BASE_PATH/data/data_source
mkdir -p $BASE_PATH/data/repositories
mkdir -p $BASE_PATH/domain/hooks
mkdir -p $BASE_PATH/domain/irepositories
mkdir -p $BASE_PATH/domain/interfaces
mkdir -p $BASE_PATH/presentation/pages
mkdir -p $BASE_PATH/presentation/components