(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["S3LambdaUtil"] = factory();
	else
		root["S3LambdaUtil"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ S3LambdaUtil; });

// EXTERNAL MODULE: external "aws-sdk"
var external_aws_sdk_ = __webpack_require__(1);
var external_aws_sdk_default = /*#__PURE__*/__webpack_require__.n(external_aws_sdk_);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(0);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(2);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);

// CONCATENATED MODULE: ./src/fs-util.js



async function createBaseDirs(filePath) {
  const dirPath = external_path_default.a.dirname(filePath);

  if (!external_fs_default.a.existsSync(dirPath)) {
    external_fs_default.a.mkdirSync(dirPath, {
      recursive: true
    });
  }
}


// CONCATENATED MODULE: ./src/index.js
/**
 * This module assumes that these functions will be used within an AWS Lambda context and the permissions required
 * to access S3 buckets are provided through the Lambda execution IAM policy
 */



const s3 = new external_aws_sdk_default.a.S3();
function S3LambdaUtil(workingDir) {
  async function listBucketObjects(bucketName, prefix) {
    const s3Params = {
      Bucket: bucketName,
      Prefix: prefix
    };
    return await s3.listObjectsV2(s3Params).promise();
  }

  async function downloadFileFromBucket(bucketNAme, key, destDir) {
    const s3Params = {
      Bucket: bucketNAme,
      Key: key
    };
    const destPath = `${destDir}/${key}`;
    return new Promise((resolve, reject) => {
      createBaseDirs(destPath);
      const outFileStream = external_fs_default.a.createWriteStream(destPath);
      const s3ReadStream = s3.getObject(s3Params).createReadStream();
      s3ReadStream.on('error', reject);
      outFileStream.on('error', reject);
      outFileStream.on('close', () => {
        resolve(destPath);
      });
      s3ReadStream.pipe(outFileStream);
    });
  }

  async function downloadDirFromBucket(bucketName, prefix, destDir) {
    const copiedFiles = [];
    const s3Contents = (await listBucketObjects(bucketName, prefix)).Contents;

    for (let i = 0; i < s3Contents.length; ++i) {
      const key = s3Contents[i].Key;
      copiedFiles.push(await downloadFileFromBucket(bucketName, key, destDir));
    }

    return copiedFiles;
  }

  async function uploadDirToBucket(bucketName, dirPath, excludes = []) {
    let targetDirs = external_fs_default.a.readdirSync(dirPath); // forEach is hard to use with await, hence a normal loop

    for (let i = 0; i < targetDirs.length; ++i) {
      const name = targetDirs[i];
      let shouldExclude = false; // Exclude files and directories if necessary; same reason as above for not using forEach

      for (let e = 0; e < excludes.length; ++e) {
        const exclude = excludes[e];

        if (exclude instanceof RegExp) {
          if (exclude.test(name)) {
            shouldExclude = true;
          }
        } else if (typeof exclude === 'string' || exclude instanceof String) {
          if (exclude === name) {
            shouldExclude = true;
          }
        }
      }

      if (!shouldExclude) {
        const filePath = path.join(dirPath, name);
        const stat = external_fs_default.a.statSync(filePath);

        if (stat.isFile()) {
          await uploadFileToBucket(bucketName, filePath);
        } else if (stat.isDirectory()) {
          await uploadDirToBucket(bucketName, filePath, excludes);
        }
      }
    }
  }

  async function uploadFileToBucket(bucketName, filePath) {
    const s3RelativePath = filePath.substring(workingDir.length + 1);
    const s3Params = {
      Bucket: bucketName,
      Key: s3RelativePath,
      Body: external_fs_default.a.readFileSync(filePath)
    };
    return await s3.putObject(s3Params).promise();
  }

  return {
    listBucketObjects,
    downloadFileFromBucket,
    downloadDirFromBucket,
    uploadDirToBucket,
    uploadFileToBucket
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUzNMYW1iZGFVdGlsLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vUzNMYW1iZGFVdGlsL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TM0xhbWJkYVV0aWwvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUzNMYW1iZGFVdGlsL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly9TM0xhbWJkYVV0aWwvZXh0ZXJuYWwgXCJhd3Mtc2RrXCIiLCJ3ZWJwYWNrOi8vUzNMYW1iZGFVdGlsL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovL1MzTGFtYmRhVXRpbC8uL3NyYy9mcy11dGlsLmpzIiwid2VicGFjazovL1MzTGFtYmRhVXRpbC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTM0xhbWJkYVV0aWxcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUzNMYW1iZGFVdGlsXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXdzLXNka1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQmFzZURpcnMoZmlsZVBhdGgpIHtcbiAgY29uc3QgZGlyUGF0aCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXJQYXRoKSkge1xuICAgIGZzLm1rZGlyU3luYyhkaXJQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgfVxufVxuXG5leHBvcnQge1xuICBjcmVhdGVCYXNlRGlyc1xufSIsIi8qKlxuICogVGhpcyBtb2R1bGUgYXNzdW1lcyB0aGF0IHRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIHVzZWQgd2l0aGluIGFuIEFXUyBMYW1iZGEgY29udGV4dCBhbmQgdGhlIHBlcm1pc3Npb25zIHJlcXVpcmVkXG4gKiB0byBhY2Nlc3MgUzMgYnVja2V0cyBhcmUgcHJvdmlkZWQgdGhyb3VnaCB0aGUgTGFtYmRhIGV4ZWN1dGlvbiBJQU0gcG9saWN5XG4gKi9cblxuaW1wb3J0IEFXUyBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBjcmVhdGVCYXNlRGlycyB9IGZyb20gJy4vZnMtdXRpbCc7XG5cbmNvbnN0IHMzID0gbmV3IEFXUy5TMygpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTM0xhbWJkYVV0aWwod29ya2luZ0Rpcikge1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGxpc3RCdWNrZXRPYmplY3RzKGJ1Y2tldE5hbWUsIHByZWZpeCkge1xuICAgIGNvbnN0IHMzUGFyYW1zID0ge1xuICAgICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgICAgUHJlZml4OiBwcmVmaXhcbiAgICB9O1xuICBcbiAgICByZXR1cm4gYXdhaXQgczMubGlzdE9iamVjdHNWMihzM1BhcmFtcykucHJvbWlzZSgpO1xuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGVGcm9tQnVja2V0KGJ1Y2tldE5BbWUsIGtleSwgZGVzdERpcikge1xuICAgIGNvbnN0IHMzUGFyYW1zID0ge1xuICAgICAgQnVja2V0OiBidWNrZXROQW1lLFxuICAgICAgS2V5OiBrZXlcbiAgICB9O1xuICBcbiAgICBjb25zdCBkZXN0UGF0aCA9IGAke2Rlc3REaXJ9LyR7a2V5fWA7XG4gICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNyZWF0ZUJhc2VEaXJzKGRlc3RQYXRoKTtcbiAgICAgIGNvbnN0IG91dEZpbGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkZXN0UGF0aCk7XG4gICAgICBjb25zdCBzM1JlYWRTdHJlYW0gPSBzMy5nZXRPYmplY3QoczNQYXJhbXMpLmNyZWF0ZVJlYWRTdHJlYW0oKTtcbiAgXG4gICAgICBzM1JlYWRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIG91dEZpbGVTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIG91dEZpbGVTdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4geyByZXNvbHZlKGRlc3RQYXRoKSB9KTtcbiAgXG4gICAgICBzM1JlYWRTdHJlYW0ucGlwZShvdXRGaWxlU3RyZWFtKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWREaXJGcm9tQnVja2V0KGJ1Y2tldE5hbWUsIHByZWZpeCwgZGVzdERpcikge1xuICAgIGNvbnN0IGNvcGllZEZpbGVzID0gW107XG4gIFxuICAgIGNvbnN0IHMzQ29udGVudHMgPSAoYXdhaXQgbGlzdEJ1Y2tldE9iamVjdHMoYnVja2V0TmFtZSwgcHJlZml4KSkuQ29udGVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGk8IHMzQ29udGVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGtleSA9IHMzQ29udGVudHNbaV0uS2V5O1xuICAgICAgY29waWVkRmlsZXMucHVzaChhd2FpdCBkb3dubG9hZEZpbGVGcm9tQnVja2V0KGJ1Y2tldE5hbWUsIGtleSwgZGVzdERpcikpO1xuICAgIH1cbiAgXG4gICAgcmV0dXJuIGNvcGllZEZpbGVzO1xuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiB1cGxvYWREaXJUb0J1Y2tldChidWNrZXROYW1lLCBkaXJQYXRoLCBleGNsdWRlcyA9IFtdKSB7XG4gICAgbGV0IHRhcmdldERpcnMgPSBmcy5yZWFkZGlyU3luYyhkaXJQYXRoKTtcbiAgXG4gICAgLy8gZm9yRWFjaCBpcyBoYXJkIHRvIHVzZSB3aXRoIGF3YWl0LCBoZW5jZSBhIG5vcm1hbCBsb29wXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXREaXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBuYW1lID0gdGFyZ2V0RGlyc1tpXTtcbiAgICAgIGxldCBzaG91bGRFeGNsdWRlID0gZmFsc2U7XG4gIFxuICAgICAgLy8gRXhjbHVkZSBmaWxlcyBhbmQgZGlyZWN0b3JpZXMgaWYgbmVjZXNzYXJ5OyBzYW1lIHJlYXNvbiBhcyBhYm92ZSBmb3Igbm90IHVzaW5nIGZvckVhY2hcbiAgICAgIGZvciAobGV0IGUgPSAwOyBlIDwgZXhjbHVkZXMubGVuZ3RoOyArK2UpIHtcbiAgICAgICAgY29uc3QgZXhjbHVkZSA9IGV4Y2x1ZGVzW2VdO1xuICBcbiAgICAgICAgaWYgKGV4Y2x1ZGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICBpZiAoZXhjbHVkZS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICBzaG91bGRFeGNsdWRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGV4Y2x1ZGUgPT09ICdzdHJpbmcnIHx8IGV4Y2x1ZGUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgICBpZiAoZXhjbHVkZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgc2hvdWxkRXhjbHVkZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgaWYgKCFzaG91bGRFeGNsdWRlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpclBhdGgsIG5hbWUpO1xuICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoZmlsZVBhdGgpO1xuICAgICAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICAgIGF3YWl0IHVwbG9hZEZpbGVUb0J1Y2tldChidWNrZXROYW1lLCBmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgYXdhaXQgdXBsb2FkRGlyVG9CdWNrZXQoYnVja2V0TmFtZSwgZmlsZVBhdGgsIGV4Y2x1ZGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgYXN5bmMgZnVuY3Rpb24gdXBsb2FkRmlsZVRvQnVja2V0KGJ1Y2tldE5hbWUsIGZpbGVQYXRoKSB7XG4gICAgY29uc3QgczNSZWxhdGl2ZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcod29ya2luZ0Rpci5sZW5ndGggKyAxKTtcbiAgXG4gICAgY29uc3QgczNQYXJhbXMgPSB7XG4gICAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgICBLZXk6IHMzUmVsYXRpdmVQYXRoLFxuICAgICAgQm9keTogZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKVxuICAgIH07XG4gIFxuICAgIHJldHVybiBhd2FpdCBzMy5wdXRPYmplY3QoczNQYXJhbXMpLnByb21pc2UoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGlzdEJ1Y2tldE9iamVjdHMsXG4gICAgZG93bmxvYWRGaWxlRnJvbUJ1Y2tldCxcbiAgICBkb3dubG9hZERpckZyb21CdWNrZXQsXG4gICAgdXBsb2FkRGlyVG9CdWNrZXQsXG4gICAgdXBsb2FkRmlsZVRvQnVja2V0XG4gIH07XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQTs7OztBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTs7OztBIiwic291cmNlUm9vdCI6IiJ9