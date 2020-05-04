/******/ (function(modules) { // webpackBootstrap
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

/* harmony default export */ var src = __webpack_exports__["default"] = (S3LambdaUtil);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhd3Mtc2RrXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy8uL3NyYy9mcy11dGlsLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhd3Mtc2RrXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVCYXNlRGlycyhmaWxlUGF0aCkge1xuICBjb25zdCBkaXJQYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpclBhdGgpKSB7XG4gICAgZnMubWtkaXJTeW5jKGRpclBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUJhc2VEaXJzXG59IiwiLyoqXG4gKiBUaGlzIG1vZHVsZSBhc3N1bWVzIHRoYXQgdGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgdXNlZCB3aXRoaW4gYW4gQVdTIExhbWJkYSBjb250ZXh0IGFuZCB0aGUgcGVybWlzc2lvbnMgcmVxdWlyZWRcbiAqIHRvIGFjY2VzcyBTMyBidWNrZXRzIGFyZSBwcm92aWRlZCB0aHJvdWdoIHRoZSBMYW1iZGEgZXhlY3V0aW9uIElBTSBwb2xpY3lcbiAqL1xuXG5pbXBvcnQgQVdTIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IGNyZWF0ZUJhc2VEaXJzIH0gZnJvbSAnLi9mcy11dGlsJztcblxuY29uc3QgczMgPSBuZXcgQVdTLlMzKCk7XG5cbmZ1bmN0aW9uIFMzTGFtYmRhVXRpbCh3b3JraW5nRGlyKSB7XG5cbiAgYXN5bmMgZnVuY3Rpb24gbGlzdEJ1Y2tldE9iamVjdHMoYnVja2V0TmFtZSwgcHJlZml4KSB7XG4gICAgY29uc3QgczNQYXJhbXMgPSB7XG4gICAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgICBQcmVmaXg6IHByZWZpeFxuICAgIH07XG4gIFxuICAgIHJldHVybiBhd2FpdCBzMy5saXN0T2JqZWN0c1YyKHMzUGFyYW1zKS5wcm9taXNlKCk7XG4gIH1cbiAgXG4gIGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkRmlsZUZyb21CdWNrZXQoYnVja2V0TkFtZSwga2V5LCBkZXN0RGlyKSB7XG4gICAgY29uc3QgczNQYXJhbXMgPSB7XG4gICAgICBCdWNrZXQ6IGJ1Y2tldE5BbWUsXG4gICAgICBLZXk6IGtleVxuICAgIH07XG4gIFxuICAgIGNvbnN0IGRlc3RQYXRoID0gYCR7ZGVzdERpcn0vJHtrZXl9YDtcbiAgICBcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY3JlYXRlQmFzZURpcnMoZGVzdFBhdGgpO1xuICAgICAgY29uc3Qgb3V0RmlsZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRlc3RQYXRoKTtcbiAgICAgIGNvbnN0IHMzUmVhZFN0cmVhbSA9IHMzLmdldE9iamVjdChzM1BhcmFtcykuY3JlYXRlUmVhZFN0cmVhbSgpO1xuICBcbiAgICAgIHMzUmVhZFN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgb3V0RmlsZVN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgb3V0RmlsZVN0cmVhbS5vbignY2xvc2UnLCAoKSA9PiB7IHJlc29sdmUoZGVzdFBhdGgpIH0pO1xuICBcbiAgICAgIHMzUmVhZFN0cmVhbS5waXBlKG91dEZpbGVTdHJlYW0pO1xuICAgIH0pO1xuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiBkb3dubG9hZERpckZyb21CdWNrZXQoYnVja2V0TmFtZSwgcHJlZml4LCBkZXN0RGlyKSB7XG4gICAgY29uc3QgY29waWVkRmlsZXMgPSBbXTtcbiAgXG4gICAgY29uc3QgczNDb250ZW50cyA9IChhd2FpdCBsaXN0QnVja2V0T2JqZWN0cyhidWNrZXROYW1lLCBwcmVmaXgpKS5Db250ZW50cztcbiAgICBmb3IgKGxldCBpID0gMDsgaTwgczNDb250ZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qga2V5ID0gczNDb250ZW50c1tpXS5LZXk7XG4gICAgICBjb3BpZWRGaWxlcy5wdXNoKGF3YWl0IGRvd25sb2FkRmlsZUZyb21CdWNrZXQoYnVja2V0TmFtZSwga2V5LCBkZXN0RGlyKSk7XG4gICAgfVxuICBcbiAgICByZXR1cm4gY29waWVkRmlsZXM7XG4gIH1cbiAgXG4gIGFzeW5jIGZ1bmN0aW9uIHVwbG9hZERpclRvQnVja2V0KGJ1Y2tldE5hbWUsIGRpclBhdGgsIGV4Y2x1ZGVzID0gW10pIHtcbiAgICBsZXQgdGFyZ2V0RGlycyA9IGZzLnJlYWRkaXJTeW5jKGRpclBhdGgpO1xuICBcbiAgICAvLyBmb3JFYWNoIGlzIGhhcmQgdG8gdXNlIHdpdGggYXdhaXQsIGhlbmNlIGEgbm9ybWFsIGxvb3BcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldERpcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB0YXJnZXREaXJzW2ldO1xuICAgICAgbGV0IHNob3VsZEV4Y2x1ZGUgPSBmYWxzZTtcbiAgXG4gICAgICAvLyBFeGNsdWRlIGZpbGVzIGFuZCBkaXJlY3RvcmllcyBpZiBuZWNlc3Nhcnk7IHNhbWUgcmVhc29uIGFzIGFib3ZlIGZvciBub3QgdXNpbmcgZm9yRWFjaFxuICAgICAgZm9yIChsZXQgZSA9IDA7IGUgPCBleGNsdWRlcy5sZW5ndGg7ICsrZSkge1xuICAgICAgICBjb25zdCBleGNsdWRlID0gZXhjbHVkZXNbZV07XG4gIFxuICAgICAgICBpZiAoZXhjbHVkZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgIGlmIChleGNsdWRlLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIHNob3VsZEV4Y2x1ZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZXhjbHVkZSA9PT0gJ3N0cmluZycgfHwgZXhjbHVkZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgIGlmIChleGNsdWRlID09PSBuYW1lKSB7XG4gICAgICAgICAgICBzaG91bGRFeGNsdWRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgXG4gICAgICBpZiAoIXNob3VsZEV4Y2x1ZGUpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyUGF0aCwgbmFtZSk7XG4gICAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XG4gICAgICAgIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICAgICAgYXdhaXQgdXBsb2FkRmlsZVRvQnVja2V0KGJ1Y2tldE5hbWUsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBhd2FpdCB1cGxvYWREaXJUb0J1Y2tldChidWNrZXROYW1lLCBmaWxlUGF0aCwgZXhjbHVkZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBhc3luYyBmdW5jdGlvbiB1cGxvYWRGaWxlVG9CdWNrZXQoYnVja2V0TmFtZSwgZmlsZVBhdGgpIHtcbiAgICBjb25zdCBzM1JlbGF0aXZlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZyh3b3JraW5nRGlyLmxlbmd0aCArIDEpO1xuICBcbiAgICBjb25zdCBzM1BhcmFtcyA9IHtcbiAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgIEtleTogczNSZWxhdGl2ZVBhdGgsXG4gICAgICBCb2R5OiBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpXG4gICAgfTtcbiAgXG4gICAgcmV0dXJuIGF3YWl0IHMzLnB1dE9iamVjdChzM1BhcmFtcykucHJvbWlzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsaXN0QnVja2V0T2JqZWN0cyxcbiAgICBkb3dubG9hZEZpbGVGcm9tQnVja2V0LFxuICAgIGRvd25sb2FkRGlyRnJvbUJ1Y2tldCxcbiAgICB1cGxvYWREaXJUb0J1Y2tldCxcbiAgICB1cGxvYWRGaWxlVG9CdWNrZXRcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTM0xhbWJkYVV0aWw7Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQTs7OztBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=