#!/bin/bash

# Script de despliegue para QA/Staging
# Uso: ./scripts/deploy.sh [staging|production]

set -e

ENV=${1:-staging}
BRANCH=$(git branch --show-current)

echo "🚀 Iniciando despliegue para entorno: $ENV"
echo "📋 Rama actual: $BRANCH"

# Validar que estamos en la rama correcta
if [ "$ENV" = "staging" ] && [ "$BRANCH" != "develop" ]; then
    echo "⚠️  Para staging debes estar en la rama 'develop'"
    echo "🔄 Cambiando a rama develop..."
    git checkout develop
    git pull origin develop
fi

if [ "$ENV" = "production" ] && [ "$BRANCH" != "main" ]; then
    echo "⚠️  Para production debes estar en la rama 'main'"
    echo "🔄 Cambiando a rama main..."
    git checkout main
    git pull origin main
fi

# Verificar que no hay cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Hay cambios sin commit. Por favor, commitea todos los cambios antes de desplegar."
    exit 1
fi

# Ejecutar tests y validaciones
echo "🧪 Ejecutando tests..."
npm run lint
npm run type-check

# Generar cliente de Prisma
echo "🗄️  Generando cliente de Prisma..."
npx prisma generate

# Build del proyecto
echo "🏗️  Construyendo proyecto..."
npm run build

# Desplegar según el entorno
if [ "$ENV" = "staging" ]; then
    echo "🚀 Desplegando a STAGING..."
    vercel --target preview --confirm
    
    echo "🗄️  Aplicando migraciones de base de datos (staging)..."
    npx prisma db push
    
    echo "✅ Despliegue a STAGING completado!"
    echo "🌐 URL: https://jordi-portfolio-staging.vercel.app"
    
elif [ "$ENV" = "production" ]; then
    echo "🚀 Desplegando a PRODUCTION..."
    vercel --prod --confirm
    
    echo "🗄️  Aplicando migraciones de base de datos (production)..."
    npx prisma db push
    
    echo "✅ Despliegue a PRODUCTION completado!"
    echo "🌐 URL: https://jordi-portfolio.vercel.app"
    
else
    echo "❌ Entorno no válido. Usa 'staging' o 'production'"
    exit 1
fi

echo "🎉 Despliegue completado exitosamente!"

# Mostrar información útil
echo ""
echo "📋 Información del despliegue:"
echo "   - Entorno: $ENV"
echo "   - Rama: $BRANCH"
echo "   - Commit: $(git rev-parse --short HEAD)"
echo "   - Fecha: $(date)"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ver logs: vercel logs"
echo "   - Abrir dashboard: vercel"
echo "   - Rollback: vercel rollback"
