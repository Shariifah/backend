#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');

// Fonction pour lister les fichiers de logs
function listLogFiles() {
  console.log('📁 Fichiers de logs disponibles:\n');
  
  const categories = ['app', 'error', 'access', 'combined'];
  
  categories.forEach(category => {
    const categoryPath = path.join(logsDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.log'))
        .sort()
        .reverse();
      
      if (files.length > 0) {
        console.log(`📋 ${category.toUpperCase()}:`);
        files.forEach(file => {
          const filePath = path.join(categoryPath, file);
          const stats = fs.statSync(filePath);
          const size = (stats.size / 1024).toFixed(2);
          console.log(`   ${file} (${size} KB)`);
        });
        console.log('');
      }
    }
  });
}

// Fonction pour afficher les dernières lignes d'un fichier
function tailLog(category, filename, lines = 50) {
  const filePath = path.join(logsDir, category, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier ${filePath} non trouvé`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const linesArray = content.split('\n').filter(line => line.trim());
  const lastLines = linesArray.slice(-lines);
  
  console.log(`📄 Dernières ${lines} lignes de ${filename}:\n`);
  lastLines.forEach(line => console.log(line));
}

// Fonction pour nettoyer les anciens logs
function cleanOldLogs(days = 30) {
  console.log(`🧹 Nettoyage des logs de plus de ${days} jours...\n`);
  
  const categories = ['app', 'error', 'access', 'combined'];
  let totalRemoved = 0;
  
  categories.forEach(category => {
    const categoryPath = path.join(logsDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.log'));
      
      files.forEach(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);
        const fileAge = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (fileAge > days) {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Supprimé: ${file} (${fileAge.toFixed(1)} jours)`);
          totalRemoved++;
        }
      });
    }
  });
  
  console.log(`\n✅ Nettoyage terminé: ${totalRemoved} fichiers supprimés`);
}

// Fonction pour afficher les statistiques des logs
function showStats() {
  console.log('📊 Statistiques des logs:\n');
  
  const categories = ['app', 'error', 'access', 'combined'];
  let totalSize = 0;
  let totalFiles = 0;
  
  categories.forEach(category => {
    const categoryPath = path.join(logsDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.log'));
      
      let categorySize = 0;
      files.forEach(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);
        categorySize += stats.size;
        totalSize += stats.size;
        totalFiles++;
      });
      
      console.log(`${category.toUpperCase()}: ${files.length} fichiers, ${(categorySize / 1024 / 1024).toFixed(2)} MB`);
    }
  });
  
  console.log(`\n📈 Total: ${totalFiles} fichiers, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'list':
  case 'ls':
    listLogFiles();
    break;
    
  case 'tail':
    if (args.length < 3) {
      console.log('Usage: node logs.js tail <category> <filename> [lines]');
      console.log('Exemple: node logs.js tail app app-2024-01-15.log 100');
    } else {
      const lines = args[3] ? parseInt(args[3]) : 50;
      tailLog(args[1], args[2], lines);
    }
    break;
    
  case 'clean':
    const days = args[1] ? parseInt(args[1]) : 30;
    cleanOldLogs(days);
    break;
    
  case 'stats':
    showStats();
    break;
    
  default:
    console.log('🔧 Utilitaire de gestion des logs\n');
    console.log('Commandes disponibles:');
    console.log('  list, ls     - Lister tous les fichiers de logs');
    console.log('  tail         - Afficher les dernières lignes d\'un fichier');
    console.log('  clean [days] - Nettoyer les anciens logs (défaut: 30 jours)');
    console.log('  stats        - Afficher les statistiques des logs\n');
    console.log('Exemples:');
    console.log('  node logs.js list');
    console.log('  node logs.js tail app app-2024-01-15.log 100');
    console.log('  node logs.js clean 7');
    console.log('  node logs.js stats');
    break;
}
