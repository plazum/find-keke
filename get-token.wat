(module
  (;(type $t0 (func (param i32)))
  (type $t1 (func (result i32)))
  (type $t2 (func))
  (type $t3 (func (param i32) (result i32)))
  (func $_initialize (export "_initialize") (type $t2)
    nop);)
  (func $get_token (export "get_token") (;(type $t0);) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    loop $L0
      local.get $l1
      i32.const 3
      i32.mul
      i32.const 1024
      i32.add
      local.tee $l2
      i32.load8_s
      local.tee $l3
      if $I1
        local.get $l1
        i32.const 1024
        i32.add
        local.get $l2
        i32.load8_s offset=2
        local.get $l3
        i32.const 9025
        i32.mul
        local.get $l2
        i32.load8_s offset=1
        i32.const 95
        i32.mul
        i32.add
        i32.add
        i32.const 291872
        i32.sub
        local.get $p0
        i32.div_s
        i32.const 32
        i32.add
        i32.store8
        local.get $l1
        i32.const 1
        i32.add
        local.set $l1
        br $L0
      end
    end)
  (;(func $stackSave (export "stackSave") (type $t1) (result i32)
    global.get $g0)
  (func $stackRestore (export "stackRestore") (type $t0) (param $p0 i32)
    local.get $p0
    global.set $g0)
  (func $stackAlloc (export "stackAlloc") (type $t3) (param $p0 i32) (result i32)
    global.get $g0
    local.get $p0
    i32.sub
    i32.const -16
    i32.and
    local.tee $p0
    global.set $g0
    local.get $p0)
  (func $__errno_location (export "__errno_location") (type $t1) (result i32)
    i32.const 2048)
  (table $__indirect_function_table (export "__indirect_function_table") 2 2 funcref);)
  (memory $memory (export "memory") 1 (;256 256;))
  ;;(global $g0 (mut i32) (i32.const 67600))
  (global $e (export "e") i32 (i32.const 1024))
  (;(elem $e0 (i32.const 1) func $_initialize);))
