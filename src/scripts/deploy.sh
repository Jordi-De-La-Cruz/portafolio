#!/bin/bash

# Script de despliegue para QA o Producción
# Uso: ./scripts/deploy.sh [staging|production]

set -e

# Config inicial
ENV=${1:-staging}
BRANCH=$(git branch --show-current)

echo "🚀 Desplegando entorno: $ENV"
echo "📋 Rama actual: $BRANCH"

# Validar rama según entorno
if [ "$ENV" = "staging" ] && [ "$BRANCH" != "develop" ]; then
    echo "⚠️  Debes estar en 'develop'"
    echo "🔄 Cambiando a 'develop'..."
    git checkout develop
    git pull origin develop
fi

if [ "$ENV" = "production" ] && [ "$BRANCH" != "main" ]; then
    echo "⚠️  Debes estar en 'main'"
    echo "🔄 Cambiando a 'main'..."
    git checkout main
    git pull origin main
fi

# Verificar cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Hay cambios sin commit"
    exit 1
fi

# Tests y validaciones
echo "🧪 Ejecutando lint y type-check..."
npm run lint
npm run type-check

# Prisma
echo "🗄️  Prisma generate..."
npx prisma generate

# Build
echo "🏗️  Construyendo proyecto..."
npm run build

# Despliegue
if [ "$ENV" = "staging" ]; then
    echo "🚀 Desplegando a STAGING..."
    vercel --target preview --confirm

    echo "📦 DB push..."
    npx prisma db push

    echo "✅ STAGING desplegado!"
    echo "🌐 https://jordi-portfolio-staging.vercel.app"

elif [ "$ENV" = "production" ]; then
    echo "🚀 Desplegando a PRODUCTION..."
    vercel --prod --confirm

    echo "📦 DB push..."
    npx prisma db push

    echo "✅ PRODUCCIÓN desplegada!"
    echo "🌐 https://jordi-portfolio.vercel.app"

else
    echo "❌ Entorno inválido. Usa 'staging' o 'production'"
    exit 1
fi

# Resumen final
echo ""
echo "🎉 Despliegue completado"
echo "📋 Entorno: $ENV"
echo "📦 Rama: $BRANCH"
echo "🔢 Commit: $(git rev-parse --short HEAD)"
echo "📅 Fecha: $(date)"

# Ayuda post-despliegue
echo ""
echo "🔧 Comandos útiles:"
echo "   - Logs: vercel logs"
echo "   - Dashboard: vercel"
echo "   - Rollback: vercel rollback"
