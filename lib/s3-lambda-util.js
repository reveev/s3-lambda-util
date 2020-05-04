(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("S3LambdaUtil", [], factory);
	else if(typeof exports === 'object')
		exports["S3LambdaUtil"] = factory();
	else
		root["S3LambdaUtil"] = factory();
})(global, function() {
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

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ S3LambdaUtil; });

// EXTERNAL MODULE: external "aws-sdk"
var external_aws_sdk_ = __webpack_require__(2);
var external_aws_sdk_default = /*#__PURE__*/__webpack_require__.n(external_aws_sdk_);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(0);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(1);
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
        const filePath = external_path_default.a.join(dirPath, name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtbGFtYmRhLXV0aWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TM0xhbWJkYVV0aWwvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1MzTGFtYmRhVXRpbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9TM0xhbWJkYVV0aWwvZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovL1MzTGFtYmRhVXRpbC9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly9TM0xhbWJkYVV0aWwvZXh0ZXJuYWwgXCJhd3Mtc2RrXCIiLCJ3ZWJwYWNrOi8vUzNMYW1iZGFVdGlsLy4vc3JjL2ZzLXV0aWwuanMiLCJ3ZWJwYWNrOi8vUzNMYW1iZGFVdGlsLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiUzNMYW1iZGFVdGlsXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlMzTGFtYmRhVXRpbFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTM0xhbWJkYVV0aWxcIl0gPSBmYWN0b3J5KCk7XG59KShnbG9iYWwsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXdzLXNka1wiKTsiLCJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUJhc2VEaXJzKGZpbGVQYXRoKSB7XG4gIGNvbnN0IGRpclBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyUGF0aCkpIHtcbiAgICBmcy5ta2RpclN5bmMoZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgY3JlYXRlQmFzZURpcnNcbn0iLCIvKipcbiAqIFRoaXMgbW9kdWxlIGFzc3VtZXMgdGhhdCB0aGVzZSBmdW5jdGlvbnMgd2lsbCBiZSB1c2VkIHdpdGhpbiBhbiBBV1MgTGFtYmRhIGNvbnRleHQgYW5kIHRoZSBwZXJtaXNzaW9ucyByZXF1aXJlZFxuICogdG8gYWNjZXNzIFMzIGJ1Y2tldHMgYXJlIHByb3ZpZGVkIHRocm91Z2ggdGhlIExhbWJkYSBleGVjdXRpb24gSUFNIHBvbGljeVxuICovXG5cbmltcG9ydCBBV1MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjcmVhdGVCYXNlRGlycyB9IGZyb20gJy4vZnMtdXRpbCc7XG5cbmNvbnN0IHMzID0gbmV3IEFXUy5TMygpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTM0xhbWJkYVV0aWwod29ya2luZ0Rpcikge1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGxpc3RCdWNrZXRPYmplY3RzKGJ1Y2tldE5hbWUsIHByZWZpeCkge1xuICAgIGNvbnN0IHMzUGFyYW1zID0ge1xuICAgICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgICAgUHJlZml4OiBwcmVmaXhcbiAgICB9O1xuICBcbiAgICByZXR1cm4gYXdhaXQgczMubGlzdE9iamVjdHNWMihzM1BhcmFtcykucHJvbWlzZSgpO1xuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGVGcm9tQnVja2V0KGJ1Y2tldE5BbWUsIGtleSwgZGVzdERpcikge1xuICAgIGNvbnN0IHMzUGFyYW1zID0ge1xuICAgICAgQnVja2V0OiBidWNrZXROQW1lLFxuICAgICAgS2V5OiBrZXlcbiAgICB9O1xuICBcbiAgICBjb25zdCBkZXN0UGF0aCA9IGAke2Rlc3REaXJ9LyR7a2V5fWA7XG4gICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNyZWF0ZUJhc2VEaXJzKGRlc3RQYXRoKTtcbiAgICAgIGNvbnN0IG91dEZpbGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkZXN0UGF0aCk7XG4gICAgICBjb25zdCBzM1JlYWRTdHJlYW0gPSBzMy5nZXRPYmplY3QoczNQYXJhbXMpLmNyZWF0ZVJlYWRTdHJlYW0oKTtcbiAgXG4gICAgICBzM1JlYWRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIG91dEZpbGVTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIG91dEZpbGVTdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4geyByZXNvbHZlKGRlc3RQYXRoKSB9KTtcbiAgXG4gICAgICBzM1JlYWRTdHJlYW0ucGlwZShvdXRGaWxlU3RyZWFtKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWREaXJGcm9tQnVja2V0KGJ1Y2tldE5hbWUsIHByZWZpeCwgZGVzdERpcikge1xuICAgIGNvbnN0IGNvcGllZEZpbGVzID0gW107XG4gIFxuICAgIGNvbnN0IHMzQ29udGVudHMgPSAoYXdhaXQgbGlzdEJ1Y2tldE9iamVjdHMoYnVja2V0TmFtZSwgcHJlZml4KSkuQ29udGVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGk8IHMzQ29udGVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGtleSA9IHMzQ29udGVudHNbaV0uS2V5O1xuICAgICAgY29waWVkRmlsZXMucHVzaChhd2FpdCBkb3dubG9hZEZpbGVGcm9tQnVja2V0KGJ1Y2tldE5hbWUsIGtleSwgZGVzdERpcikpO1xuICAgIH1cbiAgXG4gICAgcmV0dXJuIGNvcGllZEZpbGVzO1xuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiB1cGxvYWREaXJUb0J1Y2tldChidWNrZXROYW1lLCBkaXJQYXRoLCBleGNsdWRlcyA9IFtdKSB7XG4gICAgbGV0IHRhcmdldERpcnMgPSBmcy5yZWFkZGlyU3luYyhkaXJQYXRoKTtcbiAgXG4gICAgLy8gZm9yRWFjaCBpcyBoYXJkIHRvIHVzZSB3aXRoIGF3YWl0LCBoZW5jZSBhIG5vcm1hbCBsb29wXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXREaXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBuYW1lID0gdGFyZ2V0RGlyc1tpXTtcbiAgICAgIGxldCBzaG91bGRFeGNsdWRlID0gZmFsc2U7XG4gIFxuICAgICAgLy8gRXhjbHVkZSBmaWxlcyBhbmQgZGlyZWN0b3JpZXMgaWYgbmVjZXNzYXJ5OyBzYW1lIHJlYXNvbiBhcyBhYm92ZSBmb3Igbm90IHVzaW5nIGZvckVhY2hcbiAgICAgIGZvciAobGV0IGUgPSAwOyBlIDwgZXhjbHVkZXMubGVuZ3RoOyArK2UpIHtcbiAgICAgICAgY29uc3QgZXhjbHVkZSA9IGV4Y2x1ZGVzW2VdO1xuICBcbiAgICAgICAgaWYgKGV4Y2x1ZGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICBpZiAoZXhjbHVkZS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICBzaG91bGRFeGNsdWRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGV4Y2x1ZGUgPT09ICdzdHJpbmcnIHx8IGV4Y2x1ZGUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgICBpZiAoZXhjbHVkZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgc2hvdWxkRXhjbHVkZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgaWYgKCFzaG91bGRFeGNsdWRlKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpclBhdGgsIG5hbWUpO1xuICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoZmlsZVBhdGgpO1xuICAgICAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICAgIGF3YWl0IHVwbG9hZEZpbGVUb0J1Y2tldChidWNrZXROYW1lLCBmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgYXdhaXQgdXBsb2FkRGlyVG9CdWNrZXQoYnVja2V0TmFtZSwgZmlsZVBhdGgsIGV4Y2x1ZGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgYXN5bmMgZnVuY3Rpb24gdXBsb2FkRmlsZVRvQnVja2V0KGJ1Y2tldE5hbWUsIGZpbGVQYXRoKSB7XG4gICAgY29uc3QgczNSZWxhdGl2ZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcod29ya2luZ0Rpci5sZW5ndGggKyAxKTtcbiAgXG4gICAgY29uc3QgczNQYXJhbXMgPSB7XG4gICAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgICBLZXk6IHMzUmVsYXRpdmVQYXRoLFxuICAgICAgQm9keTogZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKVxuICAgIH07XG4gIFxuICAgIHJldHVybiBhd2FpdCBzMy5wdXRPYmplY3QoczNQYXJhbXMpLnByb21pc2UoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGlzdEJ1Y2tldE9iamVjdHMsXG4gICAgZG93bmxvYWRGaWxlRnJvbUJ1Y2tldCxcbiAgICBkb3dubG9hZERpckZyb21CdWNrZXQsXG4gICAgdXBsb2FkRGlyVG9CdWNrZXQsXG4gICAgdXBsb2FkRmlsZVRvQnVja2V0XG4gIH07XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQTs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=